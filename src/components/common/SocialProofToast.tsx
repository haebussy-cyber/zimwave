import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { SOCIAL_PROOF_EVENTS } from '../../data/products';

export const SocialProofToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after 3 seconds, then rotate every 12 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
        setIsVisible(true);
      }, 1000);
    }, 14000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !isVisible) return null;

  const event = SOCIAL_PROOF_EVENTS[currentIndex];

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs animate-slide-up">
      <div className="p-3 rounded-2xl bg-[#131620]/95 light:bg-white/95 backdrop-blur-xl border border-white/10 light:border-black/10 shadow-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>

        <div className="flex-1 min-w-0 text-xs">
          <div className="font-bold text-white light:text-zinc-900 truncate">
            {event.name} from {event.city}
          </div>
          <div className="text-zinc-400 truncate text-[11px]">
            Just purchased <strong className="text-[#F5B301] light:text-[#D99B00]">{event.product}</strong>
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{event.timeAgo} • Verified Zimbabwe buyer</div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-white p-1"
          title="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
