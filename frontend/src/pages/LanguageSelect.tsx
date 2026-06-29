import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Languages } from 'lucide-react';
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
    <div className="care-canvas flex min-h-screen w-full items-center justify-center p-4" style={{ minHeight: '100vh' }}>
      <main className="care-card w-full max-w-lg rounded-[28px] p-6 sm:p-8">
        <div className="mb-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efa8d0] text-[#111]">
            <Languages className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-sans text-4xl font-extrabold text-text" lang="bn">
            স্নেহআয়ু
          </h1>
          <p className="mt-2 text-sm font-bold text-text-muted">
            {t(`taglines.${currentLang}`, "আপনার শিশুর যত্নের সঙ্গী")}
          </p>

          <h2 className="mt-8 font-sans text-2xl font-extrabold text-text">
            {t('languageSelect.title', 'Select Language')}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
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
                className={`flex min-h-[64px] w-full items-center justify-between rounded-2xl border px-5 py-3 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? 'border-[#e693c5] bg-[#efa8d0] text-[#111]'
                    : 'border-border bg-surface text-text hover:bg-primary/5'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-sans text-base font-extrabold">{opt.label}</span>
                  <span className="font-sans text-xs font-bold opacity-70">{opt.subLabel}</span>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
