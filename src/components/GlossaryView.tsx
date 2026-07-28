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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header & Search */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-accent-500" />
            <h3 className="text-xl font-black text-navy-950 dark:text-white">Key Concepts & Terminology</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Essential definitions, core principles, and technical keywords extracted from your input.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search key terms..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs text-navy-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConcepts.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-slate-200 dark:border-navy-800 shadow-sm hover:border-accent-400/60 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-black text-base text-navy-950 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition">
                  {item.term}
                </h4>
                {item.importance && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-navy-950 dark:text-slate-300 border border-slate-200 dark:border-navy-800">
                    {item.importance}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-end">
              <button
                onClick={() => handleCopy(item.term, item.definition)}
                className="text-xs text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 flex items-center space-x-1 transition"
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
