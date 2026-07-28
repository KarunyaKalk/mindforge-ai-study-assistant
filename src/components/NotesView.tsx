import React, { useState } from 'react';
import { StudySet } from '../types/study';
import { FileText, Copy, Check, Download, Bookmark } from 'lucide-react';

interface NotesViewProps {
  studySet: StudySet;
}

export const NotesView: React.FC<NotesViewProps> = ({ studySet }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const defaultNotes = studySet.notes || [
    {
      id: 'note_1',
      title: `${studySet.title} - Executive Summary`,
      content: `${studySet.summary}\n\nKey takeaway: Master the core principles, understand trade-offs, and implement strict schema boundaries to guarantee runtime safety.`,
      tags: [studySet.category, studySet.difficulty],
    },
    {
      id: 'note_2',
      title: 'Architectural Best Practices',
      content: '1. Always validate dynamic inputs using Zod or equivalent type schema enforcement.\n2. Prevent race conditions in asynchronous state updates using AbortController cancellation or sequence tracking.\n3. Utilize memoization judiciously to optimize render pipeline performance.',
      tags: ['Architecture', 'Performance'],
    },
  ];

  const handleCopyNotes = () => {
    const text = defaultNotes.map((n) => `# ${n.title}\n${n.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#F4C430] mb-1">
            <FileText className="w-4 h-4" />
            <span>Structured Learning Notes</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Topic Documentation & Bullet Summary</h3>
        </div>

        <button onClick={handleCopyNotes} className="saas-button-secondary shrink-0">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy All Notes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultNotes.map((note) => (
          <div key={note.id} className="saas-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{note.title}</h4>
              <Bookmark className="w-4 h-4 text-[#F4C430]" />
            </div>

            <div className="text-sm text-slate-600 dark:text-white/70 leading-relaxed whitespace-pre-line">
              {note.content}
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
              {note.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-white/60 border border-slate-200/60 dark:border-white/[0.06]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
