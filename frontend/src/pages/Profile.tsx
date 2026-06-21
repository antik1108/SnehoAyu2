import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Baby,
  Globe,
  KeyRound,
  LogOut,
  ChevronRight,
  Check,
  Info,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { getDashboardHome } from '../features/dashboard/api';
import type { DashboardHomeData } from '../features/dashboard/types';
import { setStoredLanguage, type SupportedLanguage } from '../lib/authStorage';
import { normalizeApiError } from '../lib/apiError';
import { InlineFormError } from '../components/feedback/InlineFormError';
import api from '../lib/api';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'bn', label: 'বাংলা' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, value, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    className="flex w-full items-center gap-3 px-4 py-3.5 text-left disabled:cursor-default"
  >
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${danger ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
      {icon}
    </span>
    <span className={`flex-1 text-sm font-medium ${danger ? 'text-error' : 'text-text'}`}>{label}</span>
    {value && <span className="text-sm text-text-muted">{value}</span>}
    {onClick && <ChevronRight className="h-4 w-4 text-text-muted" aria-hidden="true" />}
  </button>
);

const ChangePinModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/auth/change-pin', { currentPassword, newPin, confirmNewPin });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-surface p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-text">{t('profile.settings.changePin', 'Change PIN')}</h3>

        {success ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
            <Check className="h-4 w-4" aria-hidden="true" />
            {t('profile.settings.pinChanged', 'PIN updated successfully.')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            {error && <InlineFormError message={error} />}
            <div>
              <label className="text-xs font-semibold text-text">{t('auth.common.password', 'Password')}</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text">{t('profile.settings.newPin', 'New 4-digit PIN')}</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="mt-1 w-full min-h-12 rounded-xl border border-border px-3 tracking-[0.5em]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text">{t('profile.settings.confirmNewPin', 'Confirm new PIN')}</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="mt-1 w-full min-h-12 rounded-xl border border-border px-3 tracking-[0.5em]"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-12 rounded-xl border border-border text-sm font-semibold text-text"
              >
                {t('checklist.actions.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 min-h-12 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {submitting ? t('checklist.actions.saving') : t('checklist.actions.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardHomeData | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);

  useEffect(() => {
    // Only mothers have data behind /dashboard/home — researchers/nurses
    // would always get a 403 here, so skip the call entirely for them.
    if (user?.role !== 'mother') return;
    getDashboardHome().then((res) => setData(res.data)).catch(() => undefined);
  }, [user]);

  const handleSelectLanguage = async (lang: SupportedLanguage) => {
    setStoredLanguage(lang);
    await i18n.changeLanguage(lang);
    setShowLanguagePicker(false);
  };

  const currentLangLabel = LANGUAGES.find((l) => l.code === (i18n.language as SupportedLanguage))?.label ?? 'বাংলা';

  return (
    <AppShell title={t('dashboard.profile.title', 'Profile')}>
      <div className="space-y-4">
        {/* Identity card */}
        <div className="surface-brand shadow-brand rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
              <User className="h-7 w-7" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-base font-bold">{data?.participant?.participantCode ?? user?.phone ?? '—'}</p>
              <p className="text-sm text-white/85">{data?.hospital?.name ?? t('profile.noHospital', 'No hospital linked')}</p>
              {data?.participant?.studyGroup && (
                <p className="mt-1 text-xs uppercase tracking-wide text-white/70">
                  {data.participant.studyGroup} {t('profile.group', 'group')}
                </p>
              )}
            </div>
          </div>
        </div>

        {data?.baby && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Baby className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{data.baby.displayName}</p>
                <p className="text-xs text-text-muted">
                  {data.baby.ageDisplay} · {t('profile.correctedAge', 'corrected')} {data.baby.correctedAgeDisplay}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings list */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface divide-y divide-border">
          <SettingsRow
            icon={<Globe className="h-4.5 w-4.5" aria-hidden="true" />}
            label={t('profile.settings.language', 'Language')}
            value={currentLangLabel}
            onClick={() => setShowLanguagePicker((v) => !v)}
          />
          {showLanguagePicker && (
            <div className="flex gap-2 px-4 pb-4 pt-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex-1 min-h-10 rounded-lg border text-sm font-semibold ${
                    i18n.language === lang.code ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
          <SettingsRow
            icon={<KeyRound className="h-4.5 w-4.5" aria-hidden="true" />}
            label={t('profile.settings.changePin', 'Change PIN')}
            onClick={() => setShowChangePin(true)}
          />
          <SettingsRow
            icon={<LogOut className="h-4.5 w-4.5" aria-hidden="true" />}
            label={t('profile.settings.logout', 'Log out')}
            onClick={() => void logout()}
            danger
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-text-muted">
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          {t('profile.appVersion', 'SnehoAyu — Version 1.0')}
        </div>
      </div>

      {showChangePin && <ChangePinModal onClose={() => setShowChangePin(false)} />}
    </AppShell>
  );
};
