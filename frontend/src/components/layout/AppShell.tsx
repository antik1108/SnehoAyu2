import React from 'react';
import { BottomNavigation } from './BottomNavigation';
import { AiAssistantButton } from '../dashboard/AiAssistantButton';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle }) => {
  return (
    /*
     * LAYOUT CONTRACT (mobile-first):
     *
     * The outer wrapper fills the full viewport height using `min-h-[100dvh]`
     * and is a flex column. The inner column (capped at max-w-md) is also a
     * flex column and uses `flex-grow` so it always reaches the bottom of the
     * wrapper — this is what keeps the sticky bottom-nav visually anchored at
     * the bottom even on short-content pages (Profile, etc.) instead of
     * floating in the middle.
     *
     * On desktop (lg:) the sidebar is `fixed`, so we offset the content area
     * with `lg:pl-64`.
     */
    <div className="flex min-h-[100dvh] flex-col bg-background text-text lg:pl-64">
      {/* Center column — grows to fill vertical space so nav stays at bottom */}
      <div className="mx-auto flex w-full max-w-md sm:max-w-xl md:max-w-3xl flex-1 flex-col px-3 sm:px-0 lg:max-w-6xl lg:px-8">
        {(title || subtitle) && (
          <header className="sticky top-0 z-10 mx-[-0.75rem] border-b border-border bg-background/90 px-5 py-4 backdrop-blur-xl sm:mx-0 lg:static lg:border-b-0 lg:bg-transparent lg:px-0 lg:pb-3 lg:pt-8">
            <div className="lg:flex lg:items-end lg:justify-between lg:gap-6">
              <div>
                <p className="mb-1 hidden text-xs font-extrabold uppercase text-secondary lg:block">SnehoAyu</p>
                {title ? <h1 className="text-2xl font-extrabold leading-tight text-text lg:text-4xl">{title}</h1> : null}
                {subtitle ? <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-text-muted lg:text-base">{subtitle}</p> : null}
              </div>
              <div className="mt-4 hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-bold text-text-muted lg:flex">
                <span className="h-2 w-2 rounded-full bg-success" />
                Care workspace
              </div>
            </div>
          </header>
        )}

        {/* Main content — flex-1 pushes the nav to the physical bottom */}
        <main className="flex-1 px-2 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-0 lg:pb-10 lg:pt-3" style={{ animation: 'fade-in 220ms ease both' }}>
          {children}
        </main>

        {/* Bottom nav is sticky so it also scrolls with content on long pages */}
        <BottomNavigation />
      </div>

      {/*
       * AI button is portalled to <body> inside the component itself, so
       * rendering it here is just a logical anchor — no DOM output here.
       * Kept outside the header to avoid backdrop-blur containing-block issues.
       */}
      <AiAssistantButton />
    </div>
  );
};
