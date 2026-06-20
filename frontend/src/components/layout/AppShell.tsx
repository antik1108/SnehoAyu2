import React from 'react';
import { BottomNavigation } from './BottomNavigation';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[100dvh] bg-background text-text">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-background">
        <main className="flex-1 px-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5">
          {(title || subtitle) && (
            <header className="mb-5 space-y-1">
              {title ? <h1 className="text-2xl font-semibold leading-tight">{title}</h1> : null}
              {subtitle ? <p className="text-sm leading-6 text-text-muted">{subtitle}</p> : null}
            </header>
          )}
          {children}
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
};
