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
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Banner / Header */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isReTestingWrong ? 'Re-Testing Wrong Answers' : 'Assessment Quiz'}
            </h3>
            {isReTestingWrong && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Focus Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
            Select an option to evaluate knowledge and view instant explanations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono font-semibold text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-[#111827] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
            Answered: {answeredCount} / {questions.length}
          </div>
          {isReTestingWrong && (
            <button
              onClick={onResetFullQuiz}
              className="text-xs font-semibold text-[#F4C430] hover:underline"
            >
              Reset Full Quiz
            </button>
          )}
        </div>
      </div>

      {/* Final Results Summary Card if Completed */}
      {quizCompleted && results && (
        <div className="saas-card p-8 border border-[#F4C430]/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F4C430] text-slate-950 flex items-center justify-center text-2xl font-extrabold shadow-sm">
                <Award className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Score: {results.scorePercentage}%
                </h4>
                <p className="text-sm text-slate-600 dark:text-white/70 mt-0.5">
                  {results.correctAnswers} out of {results.totalQuestions} questions correct.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {results.wrongQuestionIds.length > 0 && (
                <button
                  onClick={() => onRetestWrongAnswers(results.wrongQuestionIds)}
                  className="saas-button-primary"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>Re-test Wrong ({results.wrongQuestionIds.length})</span>
                </button>
              )}

              <button onClick={onResetFullQuiz} className="saas-button-secondary">
                <RotateCcw className="w-4 h-4" />
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
              className={`saas-card p-6 transition ${
                hasAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-red-500/50 bg-red-500/5'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-start space-x-2">
                  <span className="text-[#F4C430] font-mono text-sm mt-0.5">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h4>
                {hasAnswered && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-red-500 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20">
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
                    'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-white/[0.06] text-slate-800 dark:text-white hover:border-[#F4C430]';

                  if (hasAnswered) {
                    if (isRightAnswer) {
                      optionStyle =
                        'bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold';
                    } else if (isSelected && !isRightAnswer) {
                      optionStyle =
                        'bg-red-500/10 border-red-500 text-red-500 line-through';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => onAnswerQuestion(q.id, optIdx)}
                      className={`text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded bg-slate-200 dark:bg-[#161B26] flex items-center justify-center font-mono font-bold text-xs shrink-0">
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
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#111827] text-xs text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/[0.06] flex items-start space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-[#F4C430] shrink-0 mt-0.5" />
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
            className="saas-button-primary"
          >
            <span>Complete Assessment</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      )}
    </div>
  );
};
