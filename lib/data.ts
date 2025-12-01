import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- UTILITAIRES ---

// Récupère l'utilisateur connecté via le cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true }
  });

  return user;
}

// --- ADMIN DATA ---

export async function getAdminStats() {
  // 1. Calcul du revenu total
  const purchases = await prisma.purchase.findMany({
    select: { amount: true }
  });
  const totalRevenue = purchases.reduce((acc, curr) => acc + curr.amount, 0);

  // 2. Nombre d'étudiants (Rôle STUDENT)
  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" }
  });

  // 3. Nombre de cours publiés
  const activeCourses = await prisma.course.count({
    where: { isPublished: true }
  });

  return {
    revenue: totalRevenue,
    students: totalStudents,
    courses: activeCourses
  };
}

// --- STUDENT DATA ---

export async function getStudentCourses(userId: string) {
  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  userProgress: {
                    where: { userId }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  // On formate les données pour calculer la progression par cours
  return purchases.map((purchase) => {
    const course = purchase.course;
    let totalLessons = 0;
    let completedLessons = 0;

    course.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        totalLessons++;
        if (lesson.userProgress.length > 0 && lesson.userProgress[0].isCompleted) {
          completedLessons++;
        }
      });
    });

    const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    return {
      ...course,
      progress: progressPercentage,
      totalLessons,
      completedLessons
    };
  });
}

export async function getStudentGlobalProgress(userId: string) {
  // Statistiques globales pour la page Progress
  const completedLessonsCount = await prisma.userProgress.count({
    where: { userId, isCompleted: true }
  });

  // Calcul du temps total appris (somme des durées des leçons terminées)
  const completedLessons = await prisma.userProgress.findMany({
    where: { userId, isCompleted: true },
    include: { lesson: { select: { duration: true } } }
  });
  
  const totalMinutes = completedLessons.reduce((acc, curr) => acc + curr.lesson.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    completedCount: completedLessonsCount,
    timeSpent: `${hours}h ${minutes}m`
  };
}

export async function getUnpurchasedCourses(userId: string) {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      purchases: {
        none: {
          userId: userId
        }
      }
    },
    orderBy: { price: 'asc' } // On trie par prix croissant (Starter -> Emperor -> Mastery)
  });

  return courses;
}