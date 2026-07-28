import React from 'react';
import { QuizQuestion, QuizResult } from '../types/study';
import { CheckCircle, XCircle, RotateCcw, Award, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  quizAnswers: Record<string, number>;
  quizCompleted: boolean;
  isReTestingWrong: boolean;
  onAnswerQuestion: (questionId: string, optionIndex: number) => void;
  onSubmitQuiz: () => QuizResult | null;
  onRetestWrongAnswers: (wrongIds: string[]) => void;
  onResetFullQuiz: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  quizAnswers,
  quizCompleted,
  isReTestingWrong,
  onAnswerQuestion,
  onSubmitQuiz,
  onRetestWrongAnswers,
  onResetFullQuiz,
}) => {
  const answeredCount = Object.keys(quizAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  const results = quizCompleted ? onSubmitQuiz() : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner / Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isReTestingWrong ? 'Re-Testing Wrong Answers' : 'Interactive Assessment Quiz'}
            </h3>
            {isReTestingWrong && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Focus Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your understanding. Select options to reveal instant explanations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            Answered: {answeredCount} / {questions.length}
          </div>
          {isReTestingWrong && (
            <button
              onClick={onResetFullQuiz}
              className="text-xs font-semibold text-brand-600 hover:text-brand-500 underline"
            >
              Reset Full Quiz
            </button>
          )}
        </div>
      </div>

      {/* Final Results Summary Card if Completed */}
      {quizCompleted && results && (
        <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-extrabold text-amber-400 border border-white/20">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight">
                  Quiz Score: {results.scorePercentage}%
                </h4>
                <p className="text-sm text-slate-300 mt-0.5">
                  You got {results.correctAnswers} out of {results.totalQuestions} questions correct.
                </p>
              </div>
            </div>

            {/* Actions: Re-test Wrong Answers button */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {results.wrongQuestionIds.length > 0 && (
                <button
                  onClick={() => onRetestWrongAnswers(results.wrongQuestionIds)}
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-test Wrong Answers ({results.wrongQuestionIds.length})</span>
                </button>
              )}

              <button
                onClick={onResetFullQuiz}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Entire Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = quizAnswers[q.id];
          const hasAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition shadow-sm ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-red-500/50 bg-red-50/10 dark:bg-red-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-start space-x-2">
                  <span className="text-brand-600 dark:text-brand-400 font-mono">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h4>
                {hasAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isRightAnswer = optIdx === q.correctOptionIndex;

                  let optionStyle =
                    'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-500';

                  if (hasAnswered) {
                    if (isRightAnswer) {
                      optionStyle =
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isRightAnswer) {
                      optionStyle =
                        'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => onAnswerQuestion(q.id, optIdx)}
                      className={`text-left p-3.5 rounded-2xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {hasAnswered && isRightAnswer && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {hasAnswered && isSelected && !isRightAnswer && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {hasAnswered && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!quizCompleted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onSubmitQuiz}
            disabled={!isAllAnswered}
            className="flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>Complete Quiz & View Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
