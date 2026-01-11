"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markLessonAsCompleted } from "@/app/actions/progress";
import { CheckCircle, XCircle, ChevronRight, Loader2, RefreshCw } from "lucide-react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

interface StudentQuizProps {
  lessonId: string;
  courseId: string;
  nextLessonId?: string;
  questions: Question[];
}

export default function StudentQuiz({ lessonId, courseId, nextLessonId, questions }: StudentQuizProps) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (isSubmitted && isSuccess) return; // On bloque si déjà réussi
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
    // Si on change une réponse après une erreur, on retire le mode "soumis" pour permettre de réessayer
    if (isSubmitted && !isSuccess) {
        setIsSubmitted(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let allCorrect = true;

    // Vérification des réponses
    questions.forEach((q) => {
      const selectedId = selectedOptions[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selectedId !== correctOption?.id) {
        allCorrect = false;
      }
    });

    setIsSubmitted(true);
    setIsSuccess(allCorrect);

    if (allCorrect) {
      // 1. Marquer comme complété côté serveur
      await markLessonAsCompleted(lessonId, courseId);
    }

    setIsLoading(false);
  };

  const handleNext = () => {
    if (nextLessonId) {
      router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
    } else {
      router.push(`/courses/${courseId}`);
    }
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {questions.map((q, index) => (
        <div key={q.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
          <h3 className="text-lg font-bold text-white">
            <span className="text-gray-500 mr-2">{index + 1}.</span>
            {q.question}
          </h3>
          
          <div className="space-y-2">
            {q.options.map((option) => {
              const isSelected = selectedOptions[q.id] === option.id;
              // On affiche la correction uniquement si soumis
              const showCorrect = isSubmitted && option.isCorrect;
              const showWrong = isSubmitted && isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(q.id, option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    showCorrect 
                      ? "bg-green-500/20 border-green-500 text-green-200"
                      : showWrong
                      ? "bg-red-500/20 border-red-500 text-red-200"
                      : isSelected
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-black/20 border-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <span>{option.text}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Zone d'action */}
      <div className="flex justify-end pt-4">
        {isSuccess ? (
           <button 
             onClick={handleNext}
             className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all"
           >
             Continue to Next Lesson <ChevronRight className="w-5 h-5" />
           </button>
        ) : (
           <button 
             onClick={handleSubmit}
             disabled={isLoading || Object.keys(selectedOptions).length < questions.length}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
           >
             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSubmitted ? "Try Again" : "Check Answers"}
           </button>
        )}
      </div>
      
      {isSubmitted && !isSuccess && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-in fade-in slide-in-from-bottom-2">
              Some answers are incorrect. Please review and try again.
          </div>
      )}
    </div>
  );
}