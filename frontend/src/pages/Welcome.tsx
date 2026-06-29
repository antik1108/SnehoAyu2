import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, AlertTriangle, Baby, CheckCircle2, TrendingUp } from 'lucide-react';
import { ROUTES } from '../routes/paths';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&w=900&q=80';

export const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language || 'bn';

  return (
    <div className="care-canvas flex min-h-screen w-full items-center justify-center p-4 lg:p-8" style={{ minHeight: '100dvh' }}>
      <main className="care-card grid w-full max-w-6xl overflow-hidden rounded-[30px] lg:min-h-[760px] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative min-h-[430px] overflow-hidden lg:min-h-full">
          <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="care-photo-overlay absolute inset-0" />
          <div className="absolute inset-x-5 top-5 flex items-center justify-between">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-extrabold text-[#111] backdrop-blur">SnehoAyu</span>
            <span className="rounded-full bg-[#efd35c] px-3 py-2 text-xs font-extrabold text-[#111]">NICU follow-up</span>
          </div>
          <div className="absolute bottom-6 left-5 right-5 text-white lg:bottom-10 lg:left-10 lg:right-10">
            <p className="font-sans text-3xl font-extrabold drop-shadow lg:text-6xl" lang="bn">স্নেহআয়ু</p>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/90 drop-shadow lg:text-base">
              {currentLang === 'bn'
                ? 'প্রতিদিনের সহজ যত্নের নির্দেশনা, শিশুর বৃদ্ধি পর্যবেক্ষণ এবং জরুরি লক্ষণের তথ্য—সব এক জায়গায়।'
                : currentLang === 'hi'
                ? 'रोज़ की देखभाल, विकास की निगरानी और खतरे के संकेतों की जानकारी—सब एक जगह।'
                : 'Simple daily guidance, growth tracking, and urgent care information—together in one place.'}
            </p>
            <div className="mt-6 grid max-w-lg grid-cols-3 gap-2">
              {[Baby, Activity, CheckCircle2].map((Icon, index) => (
                <div key={index} className="care-glass rounded-2xl p-3 text-[#111]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <p className="mt-2 text-xs font-extrabold">{index === 0 ? 'Baby care' : index === 1 ? 'Vitals' : 'Tasks'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <h2 className="care-shell-heading text-3xl lg:text-5xl">
            {t('welcomeScreen.headline', 'Supporting you and your baby after NICU discharge')}
          </h2>

          <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-[#efd35c] p-4 text-[#181715]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/32">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-extrabold">
                {t('welcomeScreen.dailyCareGuide', 'Daily Care Guide')}
              </h3>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-[#181715]/70">
                {currentLang === 'bn'
                  ? 'নবজাতকের প্রতিদিনের সহজ যত্নের নির্দেশিকা।'
                  : currentLang === 'hi'
                  ? 'नवजात शिशु की रोज़ की देखभाल के लिए आसान मार्गदर्शन।'
                  : 'Simple support for everyday newborn care.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-[#aac3e9] p-4 text-[#181715]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/32">
              <TrendingUp className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-extrabold">
                {t('welcomeScreen.growthTracking', 'Growth Tracking')}
              </h3>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-[#181715]/70">
                {currentLang === 'bn'
                  ? 'আপনার শিশুর ওজন ও উচ্চতার বৃদ্ধি লক্ষ্য করুন।'
                  : currentLang === 'hi'
                  ? 'समय के साथ अपने शिशु के विकास की निगरानी करें।'
                  : 'Follow your baby’s growth over time.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-[#efa8d0] p-4 text-[#181715]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/32">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-extrabold">
                {t('welcomeScreen.dangerSigns', 'Danger Signs')}
              </h3>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-[#181715]/70">
                {currentLang === 'bn'
                  ? 'কখন শিশুর জরুরি চিকিৎসাসেবা প্রয়োজন তা জানুন।'
                  : currentLang === 'hi'
                  ? 'जानें कि आपके शिशु को कब तत्काल मदद की आवश्यकता है।'
                  : 'Know when your baby needs urgent help.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3.5">
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGNUP_PHONE)}
            className="min-h-[52px] w-full rounded-full bg-primary py-3 text-center font-extrabold text-primary-foreground transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('welcomeScreen.createAccount', 'Create Account')}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="min-h-[52px] w-full rounded-full border border-border bg-surface py-3 text-center font-extrabold text-text transition-all hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
        </section>
      </main>
    </div>
  );
};
