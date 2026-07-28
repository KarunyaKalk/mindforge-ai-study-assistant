import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard, SRSGrade } from '../types/study';
import {
  RotateCcw,
  Volume2,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Bookmark,
  Share2,
  Zap,
  BookmarkCheck,
  Check,
} from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onToggleStatus: (cardId: string, statusType: 'mastered' | 'review') => void;
  onGradeCard?: (cardId: string, grade: SRSGrade) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onToggleStatus,
  onGradeCard,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showQuickCheck, setShowQuickCheck] = useState<boolean>(false);
  const [selectedQuickCheckOpt, setSelectedQuickCheckOpt] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'mastered'>('all');
  const [deck, setDeck] = useState<Flashcard[]>(cards);

  useEffect(() => {
    setDeck(cards);
  }, [cards]);

  const filteredDeck = deck.filter((card) => {
    if (activeFilter === 'mastered') return card.isMastered;
    if (activeFilter === 'review') return card.needsReview;
    return true;
  });

  const activeCard = filteredDeck[currentIndex] || filteredDeck[0];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    setShowQuickCheck(false);
    setSelectedQuickCheckOpt(null);
    setCurrentIndex((prev) => (prev + 1) % (filteredDeck.length || 1));
  }, [filteredDeck.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    setShowQuickCheck(false);
    setSelectedQuickCheckOpt(null);
    setCurrentIndex((prev) => (prev - 1 + filteredDeck.length) % (filteredDeck.length || 1));
  }, [filteredDeck.length]);

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setShowQuickCheck(false);
    setSelectedQuickCheckOpt(null);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = (card: Flashcard) => {
    navigator.clipboard.writeText(`Flashcard: ${card.question}\nAnswer: ${card.answer}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleGrade = (grade: SRSGrade) => {
    if (!activeCard) return;
    if (grade === 'easy' || grade === 'good') {
      onToggleStatus(activeCard.id, 'mastered');
    } else {
      onToggleStatus(activeCard.id, 'review');
    }
    if (onGradeCard) {
      onGradeCard(activeCard.id, grade);
    }
    handleNext();
  };

  // Keyboard navigation support: Space to flip, Arrows, 1-4 keys for SRS grading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleGrade('again');
      } else if (e.key === '2') {
        e.preventDefault();
        handleGrade('hard');
      } else if (e.key === '3') {
        e.preventDefault();
        handleGrade('good');
      } else if (e.key === '4') {
        e.preventDefault();
        handleGrade('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeCard, handleGrade]);

  if (!filteredDeck.length) {
    return (
      <div className="saas-card p-10 text-center max-w-4xl mx-auto">
        <BookmarkCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Flashcards in this Filter</h3>
        <p className="text-sm text-slate-500 mt-1 mb-5">You haven't marked any cards under "{activeFilter}" yet.</p>
        <button onClick={() => setActiveFilter('all')} className="saas-button-primary mx-auto">
          View All Cards ({deck.length})
        </button>
      </div>
    );
  }

  const masteredCount = deck.filter((c) => c.isMastered).length;
  const reviewCount = deck.filter((c) => c.needsReview).length;
  const progressPercentage = Math.round((masteredCount / deck.length) * 100);

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* Top Deck Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 saas-card p-4">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-[#111827] p-1 rounded-xl border border-slate-200/80 dark:border-white/[0.06]">
          <button
            onClick={() => {
              setActiveFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-[#161B26] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-white/[0.08]'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Cards ({deck.length})
          </button>
          <button
            onClick={() => {
              setActiveFilter('mastered');
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition ${
              activeFilter === 'mastered'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mastered ({masteredCount})
          </button>
          <button
            onClick={() => {
              setActiveFilter('review');
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition ${
              activeFilter === 'review'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Needs Review ({reviewCount})
          </button>
        </div>

        {/* Deck Progress Bar & Shuffle */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-28 bg-slate-200 dark:bg-[#111827] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/[0.06]">
              <div
                className="bg-[#F4C430] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[13px] font-bold text-slate-700 dark:text-white/80 font-mono">
              {progressPercentage}%
            </span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2 rounded-lg text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-[#111827] transition"
            title="Shuffle Flashcard Deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Redesigned 500px Height Premium Flashcard */}
      <div className="perspective-1000 min-h-[500px] relative">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[500px] rounded-[16px] p-8 sm:p-10 cursor-pointer shadow-card transition-all duration-500 transform-style-3d relative flex flex-col justify-between border ${
            isFlipped
              ? 'bg-[#111827] text-white border-[#F4C430]/40'
              : 'bg-white dark:bg-[#161B26] text-slate-900 dark:text-white border-slate-200/80 dark:border-white/[0.06]'
          }`}
        >
          {/* Card Top Metadata & Action Bar */}
          <div className="flex items-center justify-between text-[13px] mb-4">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-slate-400 font-medium">
                Card {currentIndex + 1} of {filteredDeck.length}
              </span>
              {activeCard.category && (
                <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-white/80 font-mono text-[11px] font-medium border border-slate-200/80 dark:border-white/[0.08]">
                  {activeCard.category}
                </span>
              )}
            </div>

            {/* Icon Actions: Audio, Bookmark, Share, Difficulty */}
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleSpeak(isFlipped ? activeCard.answer : activeCard.question)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#111827] text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                title="Audio Read Aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#111827] text-slate-400 hover:text-[#F4C430] transition"
                title="Bookmark Card"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F4C430] text-[#F4C430]' : ''}`} />
              </button>

              <button
                onClick={() => handleShare(activeCard)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#111827] text-slate-400 hover:text-slate-700 dark:hover:text-white transition relative"
                title="Share Flashcard"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <span
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider font-mono ${
                  activeCard.difficulty === 'Hard'
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : activeCard.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}
              >
                {activeCard.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          {/* Vertically Centered Large Question with Generous Breathing Room */}
          <div className="my-auto text-center px-4 py-8 max-w-3xl mx-auto space-y-4">
            <div className="text-[12px] font-mono font-bold text-[#F4C430] uppercase tracking-widest">
              {isFlipped ? 'Answer & Explanation' : 'Question / Concept'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold leading-relaxed tracking-tight text-slate-900 dark:text-white">
              {isFlipped ? activeCard.answer : activeCard.question}
            </h2>

            {/* Hint & Quick Check Toggle */}
            {!isFlipped && (
              <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center space-x-3">
                  {activeCard.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="inline-flex items-center space-x-1.5 text-[13px] text-slate-500 dark:text-white/60 hover:text-[#F4C430] transition font-medium"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                    </button>
                  )}

                  {activeCard.quickCheck && (
                    <button
                      onClick={() => setShowQuickCheck(!showQuickCheck)}
                      className="inline-flex items-center space-x-1.5 text-[13px] font-bold text-[#F4C430] bg-[#F4C430]/10 hover:bg-[#F4C430]/20 px-3 py-1 rounded-lg border border-[#F4C430]/30 transition"
                    >
                      <Zap className="w-4 h-4 fill-[#F4C430]" />
                      <span>{showQuickCheck ? 'Hide Quick Check' : '⚡ Quick Self-Check'}</span>
                    </button>
                  )}
                </div>

                {showHint && activeCard.hint && (
                  <div className="inline-block px-4 py-2 bg-amber-500/10 text-amber-500 text-xs rounded-xl border border-amber-500/20 max-w-lg">
                    <span className="font-bold">Hint: </span>
                    {activeCard.hint}
                  </div>
                )}

                {/* Quick Check Box */}
                {showQuickCheck && activeCard.quickCheck && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-white/[0.06] text-left max-w-lg mx-auto shadow-sm">
                    <div className="text-[12px] font-mono font-bold text-[#F4C430] mb-2 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Self-Check Question:</span>
                    </div>
                    <p className="text-[14px] font-medium text-slate-900 dark:text-white mb-3">
                      {activeCard.quickCheck.question}
                    </p>
                    <div className="space-y-2">
                      {activeCard.quickCheck.options.map((opt, oIdx) => {
                        const isSelected = selectedQuickCheckOpt === oIdx;
                        const isRight = oIdx === activeCard.quickCheck!.correctIndex;

                        let optClass = "bg-white dark:bg-[#161B26] border-slate-200/80 dark:border-white/[0.06] text-slate-800 dark:text-white hover:border-[#F4C430]";
                        if (isSelected) {
                          optClass = isRight 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-bold"
                            : "bg-red-500/10 border-red-500 text-red-500 font-bold";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedQuickCheckOpt(oIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {isSelected && isRight && <span className="text-emerald-500 font-bold">✓ Correct!</span>}
                            {isSelected && !isRight && <span className="text-red-500 font-bold">✗ Try Again</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Bar & Click Flip Notice */}
          <div className="flex items-center justify-between text-[13px] pt-4 border-t border-slate-100 dark:border-white/[0.06]">
            <div className="text-slate-400 flex items-center space-x-1.5 font-mono text-[12px]">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Click card or Press Spacebar to flip</span>
            </div>

            <div className="text-slate-400 font-mono text-[12px]">
              Keyboard: <span className="font-bold text-slate-700 dark:text-white">← →</span> Navigate • <span className="font-bold text-slate-700 dark:text-white">1-4</span> Grade
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Anki Spaced Repetition Rating Action Bar (Again, Hard, Good, Easy) */}
      <div className="saas-card p-4 max-w-2xl mx-auto">
        <div className="text-[12px] font-mono text-slate-400 text-center mb-3">
          Rate your recall difficulty to optimize study repetition interval:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleGrade('again')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition active:scale-95"
          >
            <span className="font-bold text-sm">Again</span>
            <span className="text-[10px] font-mono text-red-400/80 mt-0.5">&lt; 1 min (1)</span>
          </button>

          <button
            onClick={() => handleGrade('hard')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition active:scale-95"
          >
            <span className="font-bold text-sm">Hard</span>
            <span className="text-[10px] font-mono text-amber-400/80 mt-0.5">12 hours (2)</span>
          </button>

          <button
            onClick={() => handleGrade('good')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition active:scale-95"
          >
            <span className="font-bold text-sm">Good</span>
            <span className="text-[10px] font-mono text-blue-400/80 mt-0.5">1 day (3)</span>
          </button>

          <button
            onClick={() => handleGrade('easy')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition active:scale-95"
          >
            <span className="font-bold text-sm">Easy</span>
            <span className="text-[10px] font-mono text-emerald-400/80 mt-0.5">4 days (4)</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between max-w-sm mx-auto pt-2">
        <button onClick={handlePrev} className="saas-button-secondary">
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-[13px] font-mono font-bold text-slate-500">
          {currentIndex + 1} / {filteredDeck.length}
        </span>

        <button onClick={handleNext} className="saas-button-primary">
          <span>Next</span>
          <ChevronRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
