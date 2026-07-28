import React, { useState } from 'react';
import { StudySet } from '../types/study';
import { HelpCircle, ChevronDown, ChevronUp, Award, Sparkles } from 'lucide-react';

interface InterviewViewProps {
  studySet: StudySet;
}

export const InterviewView: React.FC<InterviewViewProps> = ({ studySet }) => {
  const [expandedId, setExpandedId] = useState<string | null>('int_1');

  const questions = studySet.interviewPrep || [
    {
      id: 'int_1',
      question: `How would you explain ${studySet.title} to a Senior Engineer in a technical interview?`,
      idealAnswer: `${studySet.summary} The implementation requires strict control flow scoping, AbortController cancellation for stale async updates, and Zod runtime schema validation to ensure robust fault tolerance.`,
      followUp: 'How do you handle error boundaries and fallback states if the primary endpoint returns 500?',
      difficulty: 'Hard' as const,
    },
    {
      id: 'int_2',
      question: 'What are the main architectural trade-offs when optimizing for latency versus consistency?',
      idealAnswer: 'Optimizing for low latency often involves aggressive caching, asynchronous eventual consistency, and speculative UI updates. Optimizing for strict consistency requires synchronous blocking validation and distributed locks.',
      followUp: 'Where does CAP theorem fit into this decision model?',
      difficulty: 'Medium' as const,
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      <div className="saas-card p-6 flex items-center space-x-3">
        <Award className="w-5 h-5 text-[#F4C430]" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Senior Engineering Interview Questions</h3>
          <p className="text-xs text-slate-500 dark:text-white/60">Curated high-frequency interview prompts and ideal structural answers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isExpanded = expandedId === q.id;

          return (
            <div key={q.id} className="saas-card p-6 transition">
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="flex items-start justify-between cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded bg-[#F4C430]/10 text-[#F4C430] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-4">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {q.difficulty}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
                    <div className="text-[12px] font-mono font-bold text-[#F4C430] uppercase mb-1 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
                      <span>Ideal Architectural Answer:</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
                      {q.idealAnswer}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 text-amber-500 border border-amber-500/20 text-xs">
                    <span className="font-bold font-mono">Follow-up Interview Question: </span>
                    {q.followUp}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
