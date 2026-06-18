import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setStoredLanguage, type SupportedLanguage } from '../lib/authStorage';
import { ROUTES } from '../routes/paths';

export const LanguageSelect: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelectLanguage = async (lang: SupportedLanguage) => {
    setStoredLanguage(lang);
    await i18n.changeLanguage(lang);
    navigate(ROUTES.WELCOME, { replace: true });
  };

  const currentLang = i18n.language || 'bn';

  const options: Array<{ code: SupportedLanguage; label: string; subLabel: string; ariaLabel: string }> = [
    {
      code: 'bn',
      label: t('languageSelect.button_bn', 'বাংলা'),
      subLabel: t('languageSelect.button_bn_sub', 'Bengali'),
      ariaLabel: t('languageSelect.ariaLabel_bn', 'Select Bengali language'),
    },
    {
      code: 'hi',
      label: t('languageSelect.button_hi', 'हिंदी'),
      subLabel: t('languageSelect.button_hi_sub', 'Hindi'),
      ariaLabel: t('languageSelect.ariaLabel_hi', 'Select Hindi language'),
    },
    {
      code: 'en',
      label: t('languageSelect.button_en', 'English'),
      subLabel: t('languageSelect.button_en_sub', 'English'),
      ariaLabel: t('languageSelect.ariaLabel_en', 'Select English language'),
    },
  ];

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background p-4"
      style={{ minHeight: '100vh' }}
    >
      <main className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="font-sans text-3xl font-bold text-primary mb-2" lang="bn">
            স্নেহআয়ু
          </h1>
          <p className="text-sm font-medium text-text-muted mb-4">
            {t(`taglines.${currentLang}`, "আপনার শিশুর যত্নের সঙ্গী")}
          </p>

          <div className="h-px w-16 bg-border mb-6" />

          <h2 className="font-sans text-xl font-semibold text-text mb-2">
            {t('languageSelect.title', 'Select Language')}
          </h2>
          <p className="text-xs text-text-muted">
            {t('languageSelect.subtitle', 'Choose your preferred language to proceed')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {options.map((opt) => {
            const isSelected = currentLang === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                aria-label={opt.ariaLabel}
                aria-current={isSelected ? 'true' : undefined}
                className={`w-full min-h-[56px] py-3 px-5 rounded-xl border flex justify-between items-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border bg-surface text-text hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-sans text-base font-medium">{opt.label}</span>
                  <span className="font-sans text-xs text-text-muted font-normal">{opt.subLabel}</span>
                </div>
                {isSelected && (
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
