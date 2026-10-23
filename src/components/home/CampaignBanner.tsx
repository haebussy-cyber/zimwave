import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CampaignBannerProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  href?: string;
}

export const CampaignBanner: React.FC<CampaignBannerProps> = ({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  href
}) => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-zinc-900 text-white">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
      />
      <div className="absolute inset-0 mx-auto flex w-full max-w-[1280px] items-center px-3 sm:px-6 sm:py-6 lg:px-8">
        <div className="max-w-[85%] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:max-w-md">
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#FFFFFF] sm:text-xs sm:tracking-[0.16em]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 max-w-lg text-sm font-bold leading-tight text-[#FFFFFF] sm:mt-2 sm:text-2xl lg:text-3xl">
            {title}
          </h2>
          <p className="mt-1 hidden max-w-md text-xs leading-relaxed text-[#FFFFFF] sm:mt-2 sm:block sm:text-sm">
            {description}
          </p>
          {onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-1 inline-flex min-h-8 items-center gap-1 rounded-lg bg-[#F5B301] px-2.5 text-[9px] font-bold text-zinc-950 transition-colors hover:bg-[#E5A500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-4 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-8 items-center gap-1 rounded-lg bg-[#F5B301] px-2.5 text-[9px] font-bold text-zinc-950 transition-colors hover:bg-[#E5A500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:mt-4 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
};