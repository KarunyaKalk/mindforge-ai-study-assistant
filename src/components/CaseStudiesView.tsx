import React from 'react';
import { StudySet } from '../types/study';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface CaseStudiesViewProps {
  studySet: StudySet;
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({ studySet }) => {
  const caseStudies = studySet.caseStudies || [
    {
      id: 'cs_1',
      companyOrScenario: 'Production High-Scale Deployment',
      problemStatement: `Handling rapid state mutations and async data fetching across 100,000+ concurrent user sessions without memory leaks or race conditions.`,
      architecturalSolution: `Implemented AbortController request sequence tracking, Zod runtime validation, and strict 60-30-10 SDE design system tokens.`,
      keyTakeaway: `Strict runtime type safety combined with interruptible rendering guarantees 99.99% frontend stability.`,
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      <div className="saas-card p-6 flex items-center space-x-3">
        <Building2 className="w-5 h-5 text-[#F4C430]" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Real-World Case Studies</h3>
          <p className="text-xs text-slate-500 dark:text-white/60">Production architectural breakdowns and post-mortem analysis.</p>
        </div>
      </div>

      <div className="space-y-6">
        {caseStudies.map((cs) => (
          <div key={cs.id} className="saas-card p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#F4C430]"></span>
                <span>{cs.companyOrScenario}</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Case Study #1</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
                <div className="text-xs font-mono font-bold text-red-500 uppercase">Problem Statement</div>
                <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
                  {cs.problemStatement}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
                <div className="text-xs font-mono font-bold text-emerald-500 uppercase">Architectural Solution</div>
                <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
                  {cs.architecturalSolution}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F4C430]/10 border border-[#F4C430]/20 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#F4C430] shrink-0" />
              <div className="text-xs text-slate-800 dark:text-white font-medium">
                <span className="font-bold text-[#F4C430]">Key Takeaway: </span>
                {cs.keyTakeaway}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
