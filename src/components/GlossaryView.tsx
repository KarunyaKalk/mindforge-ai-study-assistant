import React, { useState } from 'react';
import { KeyConcept } from '../types/study';
import { BookMarked, Search, Copy, Check } from 'lucide-react';

interface GlossaryViewProps {
  concepts: KeyConcept[];
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ concepts }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const filteredConcepts = concepts.filter(
    (c) =>
      c.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (term: string, definition: string) => {
    navigator.clipboard.writeText(`${term}: ${definition}`);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Header & Search */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-[#F4C430]" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Key Concepts & Terms</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
            Essential definitions and domain vocabulary extracted from source notes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F4C430] transition"
          />
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConcepts.map((item, index) => (
          <div
            key={index}
            className="saas-card p-6 flex flex-col justify-between hover:border-[#F4C430]/60 transition group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#F4C430] transition">
                  {item.term}
                </h4>
                {item.importance && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-white/70 border border-slate-200/80 dark:border-white/[0.06]">
                    {item.importance}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end">
              <button
                onClick={() => handleCopy(item.term, item.definition)}
                className="text-xs text-slate-400 hover:text-[#F4C430] flex items-center space-x-1.5 transition"
                title="Copy term and definition"
              >
                {copiedTerm === item.term ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
