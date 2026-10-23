import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhatsAppConciergeBanner: React.FC = () => {
  const { activeCity } = useStore();
  const message = encodeURIComponent(`Hello ZimMobile, I have a question about phones in ${activeCity}.`);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">Questions about a phone?</h2>
          <p className="mt-1 text-sm text-zinc-600">Message ZimMobile on WhatsApp about a model, variant or delivery area.</p>
        </div>
        <a
          href={`https://wa.me/263771234567?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5B301] px-4 text-sm font-bold text-zinc-950 hover:bg-[#E5A500]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
};
