import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const HERO_IMAGE = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80';

export const AuthPageShell: React.FC<AuthPageShellProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-teal-50 via-background to-background p-4"
      style={{ minHeight: '100dvh' }}
    >
      <main className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-teal-900/5">
        {/* Hero image */}
        <div className="relative h-36 w-full overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/10 to-transparent" />

          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-text backdrop-blur hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-3 left-6 right-6">
            <p className="font-sans text-lg font-bold text-white drop-shadow" lang="bn">স্নেহআয়ু</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="font-sans text-xl font-semibold text-text">{title}</h2>
            {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{subtitle}</p>}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
