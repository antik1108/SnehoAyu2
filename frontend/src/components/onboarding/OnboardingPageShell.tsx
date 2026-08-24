import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStepIndicator } from './OnboardingStepIndicator';

interface OnboardingPageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  showBackButton?: boolean;
  onBack?: () => void;
}

const HERO_IMAGE = 'https://images.unsplash.com/photo-1630305130592-210da48f151e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const OnboardingPageShell: React.FC<OnboardingPageShellProps> = ({
  children,
  title,
  subtitle,
  currentStep,
  showBackButton = true,
  onBack,
}) => {
  const navigate = useNavigate();
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Show indicator if the user hasn't scrolled near the bottom (24px threshold)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 24;
      setShowScrollIndicator(!isNearBottom);
    }
  };

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight + 10);
      }
    };

    // Delay checking slightly to ensure children are fully rendered and layout is updated
    const timer = setTimeout(checkScrollable, 100);

    window.addEventListener('resize', checkScrollable);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollable);
    };
  }, [children]);

  return (
    <div className="care-canvas flex min-h-screen w-full items-center justify-center p-4 lg:p-8" style={{ minHeight: '100dvh' }}>
      <main className="care-card relative grid w-full max-w-5xl overflow-hidden rounded-[28px] lg:h-[760px] lg:max-h-[90vh] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-full overflow-hidden lg:block">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="care-photo-overlay absolute inset-0" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm font-extrabold uppercase text-white/72">SnehoAyu</p>
            <h1 className="mt-2 max-w-md text-5xl font-extrabold leading-none">A calm setup for safer care.</h1>
          </div>
        </div>

        <div className="relative h-32 w-full overflow-hidden lg:hidden">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="care-photo-overlay absolute inset-0" />

          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="absolute left-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-text backdrop-blur hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-3 left-6 right-6">
            <p className="font-sans text-base font-bold text-white drop-shadow" lang="bn">স্নেহআয়ু</p>
          </div>
        </div>

        <div className="relative flex flex-col lg:h-full lg:overflow-hidden">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex flex-col justify-start p-6 sm:p-8 lg:p-12 lg:h-full lg:overflow-y-auto"
          >
            <div className="mb-4">
              <p className="text-xs font-extrabold uppercase text-secondary">Setup</p>
              <h2 className="care-shell-heading mt-2 text-3xl lg:text-4xl">{title}</h2>
              {subtitle && <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-text-muted">{subtitle}</p>}
            </div>

            <OnboardingStepIndicator currentStep={currentStep} />

            {children}
          </div>

          {/* Fade mask at bottom to indicate scrollable content */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-16 transition-opacity duration-300 hidden lg:block ${showScrollIndicator ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backgroundImage: 'linear-gradient(to top, color-mix(in srgb, var(--color-surface) 94%, white) 20%, transparent)',
              borderBottomRightRadius: '28px',
            }}
          />

          {/* Floating bouncing "Scroll for more" pill */}
          <div
            className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary/95 px-3 py-1.5 text-xs font-extrabold text-primary-foreground shadow-md transition-opacity duration-300 hidden lg:flex ${showScrollIndicator ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <span>Scroll for more</span>
            <svg className="h-3 w-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};
