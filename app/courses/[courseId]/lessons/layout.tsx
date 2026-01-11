import CourseSidebar from "@/components/CourseSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import { getCurrentUser } from "@/lib/data";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  const role = user?.role === "ADMIN" ? "ADMIN" : "STUDENT";

  return (
    <div className="h-full min-h-screen flex flex-col">
      <DashboardNavbar role={role} userName={user?.name} />
      
      <div className="flex-1 flex pt-16 h-full">
        {/* Sidebar Liste des leçons */}
        <CourseSidebar courseId={courseId} />
        
        {/* Zone Principale (Vidéo) */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}