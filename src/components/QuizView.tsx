import React from 'react';
import { QuizQuestion, QuizResult } from '../types/study';
import { CheckCircle, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from 'lucide-react';

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
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-black text-navy-950 dark:text-white">
              {isReTestingWrong ? 'Re-Testing Wrong Answers' : 'Interactive Assessment Quiz'}
            </h3>
            {isReTestingWrong && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Focus Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your understanding. Select options to reveal instant explanations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono font-bold text-navy-900 dark:text-slate-200 bg-slate-100 dark:bg-navy-950 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-800">
            Answered: {answeredCount} / {questions.length}
          </div>
          {isReTestingWrong && (
            <button
              onClick={onResetFullQuiz}
              className="text-xs font-extrabold text-accent-600 dark:text-accent-400 hover:underline"
            >
              Reset Full Quiz
            </button>
          )}
        </div>
      </div>

      {/* Final Results Summary Card if Completed */}
      {quizCompleted && results && (
        <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-accent-400/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-accent-400 text-navy-950 flex items-center justify-center text-3xl font-black border border-accent-300 shadow-lg shadow-accent-400/20">
                <Award className="w-8 h-8 text-navy-950" />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight text-white">
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
                  className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-navy-950 font-black text-xs shadow-lg transition"
                >
                  <RotateCcw className="w-4 h-4 text-navy-950" />
                  <span>Re-test Wrong Answers ({results.wrongQuestionIds.length})</span>
                </button>
              )}

              <button
                onClick={onResetFullQuiz}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
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
              className={`bg-white dark:bg-navy-900 rounded-3xl p-6 border transition shadow-sm ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-red-500/50 bg-red-50/20 dark:bg-red-950/20'
                  : 'border-slate-200 dark:border-navy-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h4 className="text-base sm:text-lg font-black text-navy-950 dark:text-white flex items-start space-x-2">
                  <span className="text-accent-600 dark:text-accent-400 font-mono">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h4>
                {hasAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
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
                    'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-navy-900 dark:text-slate-200 hover:border-accent-400';

                  if (hasAnswered) {
                    if (isRightAnswer) {
                      optionStyle =
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isRightAnswer) {
                      optionStyle =
                        'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-950 dark:text-red-200 line-through';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => onAnswerQuestion(q.id, optIdx)}
                      className={`text-left p-3.5 rounded-2xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-navy-800 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
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
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-navy-950 text-xs text-navy-900 dark:text-slate-300 border border-slate-200 dark:border-navy-800 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-navy-950 dark:text-white">Explanation: </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button (Soft Yellow CTA) */}
      {!quizCompleted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onSubmitQuiz}
            disabled={!isAllAnswered}
            className="flex items-center space-x-2 px-6 py-3 bg-accent-400 hover:bg-accent-300 text-navy-950 font-black text-sm rounded-2xl shadow-lg shadow-accent-400/20 border border-accent-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span>Complete Quiz & View Analysis</span>
            <ArrowRight className="w-4 h-4 text-navy-950" />
          </button>
        </div>
      )}
    </div>
  );
};
