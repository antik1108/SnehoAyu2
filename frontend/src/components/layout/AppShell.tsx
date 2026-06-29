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
    <div className="min-h-[100dvh] bg-background text-text lg:pl-64">
      <div className="mx-auto flex w-full max-w-md flex-col px-3 sm:px-0 lg:max-w-6xl lg:px-8">
        {(title || subtitle) && (
          <header className="sticky top-0 z-10 mx-[-0.75rem] border-b border-border bg-background/88 px-5 py-5 backdrop-blur-xl sm:mx-0 lg:static lg:border-b-0 lg:bg-transparent lg:px-0 lg:pb-3 lg:pt-8">
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
        <main className="flex-1 px-2 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-0 lg:pb-10 lg:pt-3">
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
