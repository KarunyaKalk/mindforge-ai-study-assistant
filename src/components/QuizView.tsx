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
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Banner / Header */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isReTestingWrong ? 'Re-Testing Wrong Answers' : 'Assessment Quiz'}
            </h3>
            {isReTestingWrong && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                Focus Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an option to evaluate knowledge and view instant explanations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#070b14] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            Answered: {answeredCount} / {questions.length}
          </div>
          {isReTestingWrong && (
            <button
              onClick={onResetFullQuiz}
              className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Reset Full Quiz
            </button>
          )}
        </div>
      </div>

      {/* Final Results Summary Card if Completed */}
      {quizCompleted && results && (
        <div className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center text-2xl font-extrabold border border-yellow-300">
                <Award className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Score: {results.scorePercentage}%
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                  {results.correctAnswers} out of {results.totalQuestions} questions correct.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {results.wrongQuestionIds.length > 0 && (
                <button
                  onClick={() => onRetestWrongAnswers(results.wrongQuestionIds)}
                  className="sde-button-primary"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                  <span>Re-test Wrong ({results.wrongQuestionIds.length})</span>
                </button>
              )}

              <button
                onClick={onResetFullQuiz}
                className="sde-button-secondary"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const selectedOption = quizAnswers[q.id];
          const hasAnswered = selectedOption !== undefined;
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-[#0f172a] rounded-2xl p-5 border transition shadow-sm ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-red-500/50 bg-red-50/10 dark:bg-red-950/10'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-start space-x-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-mono text-xs mt-0.5">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h4>
                {hasAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-red-700 dark:text-red-300 px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800">
                        <XCircle className="w-3 h-3" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isRightAnswer = optIdx === q.correctOptionIndex;

                  let optionStyle =
                    'bg-slate-50 dark:bg-[#070b14] border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-yellow-400';

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
                      className={`text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {hasAnswered && isRightAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      {hasAnswered && isSelected && !isRightAnswer && (
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {hasAnswered && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#070b14] text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                  <HelpCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
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
        <div className="flex justify-end pt-1">
          <button
            onClick={onSubmitQuiz}
            disabled={!isAllAnswered}
            className="sde-button-primary"
          >
            <span>Complete Quiz</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      )}
    </div>
  );
};
