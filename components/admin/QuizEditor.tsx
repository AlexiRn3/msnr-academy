"use client";

import { useState } from "react";
import { saveQuiz } from "@/app/actions/quiz";
import { Plus, Trash, Save, CheckCircle, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Types locaux pour l'état du formulaire
type Option = { text: string; isCorrect: boolean };
type Question = { question: string; options: Option[] };

interface QuizEditorProps {
  lessonId: string;
  initialQuestions?: any[]; // On pourra passer les questions existantes ici plus tard
}

export default function QuizEditor({ lessonId, initialQuestions = [] }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length > 0 ? initialQuestions : [{ question: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQ = [...questions];
    newQ[index].question = text;
    setQuestions(newQ);
  };

  const addOption = (qIndex: number) => {
    const newQ = [...questions];
    newQ[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(newQ);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQ = [...questions];
    newQ[qIndex].options[oIndex].text = text;
    setQuestions(newQ);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQ = [...questions];
    // On met tout à false d'abord (choix unique pour l'instant)
    newQ[qIndex].options.forEach(o => o.isCorrect = false);
    newQ[qIndex].options[oIndex].isCorrect = true;
    setQuestions(newQ);
  };

  const handleSave = async () => {
    setIsLoading(true);
    await saveQuiz(lessonId, { questions });
    setIsLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-8 bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Quiz Editor</h2>
        <button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />}
            Save Quiz
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold shrink-0">
                {qIndex + 1}
              </div>
              <input
                type="text"
                placeholder="Write your question here..."
                className="flex-1 bg-transparent text-white font-bold text-lg border-b border-white/10 focus:border-blue-500 focus:outline-none pb-2"
                value={q.question}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              />
              <button onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300">
                <Trash className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 pl-12">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <button onClick={() => setCorrectOption(qIndex, oIndex)}>
                    {opt.isCorrect ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />}
                  </button>
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    className={`flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 ${opt.isCorrect ? "ring-green-500/50 border border-green-500/30" : "focus:ring-blue-500/50 border border-transparent"}`}
                    value={opt.text}
                    onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                  />
                </div>
              ))}
              <button onClick={() => addOption(qIndex)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2">
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addQuestion} className="w-full py-4 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" /> Add New Question
      </button>
    </div>
  );
}