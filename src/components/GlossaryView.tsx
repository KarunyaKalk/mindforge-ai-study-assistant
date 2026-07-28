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
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Header & Search */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookMarked className="w-4 h-4 text-yellow-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Concepts & Terms</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential definitions and domain vocabulary extracted from source notes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredConcepts.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-yellow-400/60 transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition">
                  {item.term}
                </h4>
                {item.importance && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.importance}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => handleCopy(item.term, item.definition)}
                className="text-xs text-slate-400 hover:text-yellow-500 flex items-center space-x-1 transition"
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
