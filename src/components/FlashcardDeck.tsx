import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types/study';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  BookmarkCheck,
} from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onToggleStatus: (cardId: string, statusType: 'mastered' | 'review') => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, onToggleStatus }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
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
    setCurrentIndex((prev) => (prev + 1) % (filteredDeck.length || 1));
  }, [filteredDeck.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + filteredDeck.length) % (filteredDeck.length || 1));
  }, [filteredDeck.length]);

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard navigation support
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
      } else if (e.code === 'ArrowUp' && activeCard) {
        e.preventDefault();
        onToggleStatus(activeCard.id, 'mastered');
      } else if (e.code === 'ArrowDown' && activeCard) {
        e.preventDefault();
        onToggleStatus(activeCard.id, 'review');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeCard, onToggleStatus]);

  if (!filteredDeck.length) {
    return (
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
        <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Flashcards in this Filter</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">You haven't marked any cards under "{activeFilter}" yet.</p>
        <button
          onClick={() => setActiveFilter('all')}
          className="sde-button-primary"
        >
          View All Cards ({deck.length})
        </button>
      </div>
    );
  }

  const masteredCount = deck.filter((c) => c.isMastered).length;
  const reviewCount = deck.filter((c) => c.needsReview).length;
  const progressPercentage = Math.round((masteredCount / deck.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Top Deck Toolbar & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#070b14] p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({deck.length})
          </button>
          <button
            onClick={() => {
              setActiveFilter('mastered');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeFilter === 'mastered'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered ({masteredCount})</span>
          </button>
          <button
            onClick={() => {
              setActiveFilter('review');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeFilter === 'review'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Review ({reviewCount})</span>
          </button>
        </div>

        {/* Progress Bar & Shuffle */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              {progressPercentage}%
            </span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div className="perspective-1000 min-h-[300px] sm:min-h-[340px] relative">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[300px] sm:min-h-[340px] rounded-2xl p-6 sm:p-8 cursor-pointer shadow-md transition-all duration-300 transform-style-3d relative flex flex-col justify-between border ${
            isFlipped
              ? 'bg-slate-900 text-white border-yellow-400/50'
              : 'bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-800'
          }`}
        >
          {/* Card Top Metadata Bar */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-slate-400 text-[11px]">
                Card {currentIndex + 1} of {filteredDeck.length}
              </span>
              {activeCard.category && (
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                  {activeCard.category}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleSpeak(isFlipped ? activeCard.answer : activeCard.question)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                title="Listen"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  activeCard.difficulty === 'Hard'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : activeCard.difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {activeCard.difficulty || 'Medium'}
              </span>
            </div>
          </div>

          {/* Main Card Content */}
          <div className="my-auto text-center px-2 py-4">
            <div className="text-[11px] font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-2">
              {isFlipped ? 'Answer' : 'Question'}
            </div>

            <h3 className="text-lg sm:text-xl font-bold leading-relaxed tracking-tight">
              {isFlipped ? activeCard.answer : activeCard.question}
            </h3>

            {/* Hint */}
            {!isFlipped && activeCard.hint && (
              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                {showHint ? (
                  <div className="inline-block px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs rounded-xl border border-amber-200 dark:border-amber-800 max-w-md">
                    <span className="font-bold">Hint: </span>
                    {activeCard.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-yellow-500 transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Show Hint</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Indicator & Actions */}
          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="text-slate-400 text-[11px] flex items-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>Click or Space to flip</span>
            </div>

            {/* Status Toggles */}
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onToggleStatus(activeCard.id, 'review')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeCard.needsReview
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Review</span>
              </button>

              <button
                onClick={() => onToggleStatus(activeCard.id, 'mastered')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeCard.isMastered
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between max-w-sm mx-auto pt-1">
        <button
          onClick={handlePrev}
          className="sde-button-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous (←)</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-500">
          {currentIndex + 1} / {filteredDeck.length}
        </span>

        <button
          onClick={handleNext}
          className="sde-button-primary"
        >
          <span>Next (→)</span>
          <ChevronRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
