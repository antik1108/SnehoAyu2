import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

export const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'bn';

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background p-4"
      style={{ minHeight: '100dvh' }}
    >
      <main className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="font-sans text-3xl font-bold text-primary mb-2" lang="bn">
            স্নেহআয়ু
          </h1>
          
          <h2 className="font-sans text-lg font-bold text-text mb-2 px-2 leading-snug">
            {t('welcomeScreen.headline', 'Supporting you and your baby after NICU discharge')}
          </h2>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            {currentLang === 'bn' 
              ? 'প্রতিদিনের সহজ যত্নের নির্দেশনা, শিশুর বৃদ্ধি পর্যবেক্ষণ এবং জরুরি লক্ষণের তথ্য—সব এক জায়গায়।'
              : currentLang === 'hi'
              ? 'रोज़ की देखभाल, विकास की निगरानी और खतरे के संकेतों की जानकारी—सब एक जगह।'
              : 'Simple daily guidance, growth tracking, and urgent care information—together in one place.'}
          </p>
          <div className="h-px w-16 bg-border mt-4" />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start gap-3.5 p-3 rounded-xl border border-border bg-background/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-text">
                {t('welcomeScreen.dailyCareGuide', 'Daily Care Guide')}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                {currentLang === 'bn'
                  ? 'নবজাতকের প্রতিদিনের সহজ যত্নের নির্দেশিকা।'
                  : currentLang === 'hi'
                  ? 'नवजात शिशु की रोज़ की देखभाल के लिए आसान मार्गदर्शन।'
                  : 'Simple support for everyday newborn care.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl border border-border bg-background/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-text">
                {t('welcomeScreen.growthTracking', 'Growth Tracking')}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                {currentLang === 'bn'
                  ? 'আপনার শিশুর ওজন ও উচ্চতার বৃদ্ধি লক্ষ্য করুন।'
                  : currentLang === 'hi'
                  ? 'समय के साथ अपने शिशु के विकास की निगरानी करें।'
                  : 'Follow your baby’s growth over time.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl border border-border bg-background/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-text">
                {t('welcomeScreen.dangerSigns', 'Danger Signs')}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                {currentLang === 'bn'
                  ? 'কখন শিশুর জরুরি চিকিৎসাসেবা প্রয়োজন তা জানুন।'
                  : currentLang === 'hi'
                  ? 'जानें कि आपके शिशु को कब तत्काल मदद की आवश्यकता है।'
                  : 'Know when your baby needs urgent help.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGNUP_PHONE)}
            className="w-full min-h-[48px] py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('welcomeScreen.createAccount', 'Create Account')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full min-h-[48px] py-3 border border-border bg-surface text-text font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('welcomeScreen.alreadyHaveAccount', 'I Already Have an Account')}
          </button>

          <Link
            to={ROUTES.LANGUAGE_SELECT}
            className="mt-2 text-center text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {currentLang === 'bn' ? 'বাংলা / ভাষা পরিবর্তন করুন' : currentLang === 'hi' ? 'हिंदी / भाषा बदलें' : 'English / Change Language'}
          </Link>
        </div>
      </main>
    </div>
  );
};
