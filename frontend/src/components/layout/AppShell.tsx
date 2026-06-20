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
    <div className="min-h-[100dvh] bg-gradient-to-b from-teal-50/60 via-background to-background text-text">
      <div className="mx-auto flex w-full max-w-md flex-col">
        {(title || subtitle) && (
          <header className="sticky top-0 z-10 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur-sm">
            {title ? <h1 className="text-xl font-bold leading-tight text-text">{title}</h1> : null}
            {subtitle ? <p className="mt-0.5 text-sm leading-6 text-text-muted">{subtitle}</p> : null}
          </header>
        )}
        <main className="flex-1 px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5">
          {children}
        </main>
        <BottomNavigation />
      </div>
      {/* Rendered outside the header (which has backdrop-blur, a CSS
          containing-block trigger for fixed-position descendants) so the
          floating button positions correctly against the viewport. */}
      <AiAssistantButton />
    </div>
  );
};
