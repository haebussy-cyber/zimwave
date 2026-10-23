import React, { useEffect, useRef } from 'react';

interface CampaignVideoProps {
  src: string;
  title: string;
  description: string;
}

export const CampaignVideo: React.FC<CampaignVideoProps> = ({ src, title, description }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let isNearViewport = false;
    let frame: number | null = null;
    const startPlayback = () => {
      if (!isNearViewport || video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return;
      void video.play().catch(() => {});
    };

    const updatePlayback = () => {
      frame = null;
      const bounds = section.getBoundingClientRect();
      const shouldPlay = bounds.top < window.innerHeight + 200 && bounds.bottom > -200;

      if (shouldPlay) {
        isNearViewport = true;
        if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
          video.preload = 'auto';
          video.load();
        } else {
          startPlayback();
        }
      } else {
        isNearViewport = false;
        video.pause();
      }
    };
    const schedulePlaybackUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updatePlayback);
    };

    schedulePlaybackUpdate();
    window.addEventListener('scroll', schedulePlaybackUpdate, { passive: true });
    window.addEventListener('resize', schedulePlaybackUpdate);
    video.addEventListener('canplay', startPlayback);

    return () => {
      window.removeEventListener('scroll', schedulePlaybackUpdate);
      window.removeEventListener('resize', schedulePlaybackUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      video.removeEventListener('canplay', startPlayback);
      video.pause();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate h-[320px] w-full overflow-hidden bg-zinc-950 text-white sm:h-[260px] lg:h-[320px] boaderra">
      <video
        ref={videoRef}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
      <div className="relative z-20 mx-auto flex h-full w-full max-w-[1280px] flex-col items-start justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFFFFF] sm:text-xs">
          Featured video
        </p>
        <h2 className="mt-2 max-w-xl text-xl font-bold leading-tight text-[#FFFFFF] sm:text-2xl lg:text-3xl">{title}</h2>
        <p className="mt-1 max-w-lg text-xs text-[#FFFFFF] sm:text-sm">{description}</p>
        </div>
      </div>
    </section>
  );
};
