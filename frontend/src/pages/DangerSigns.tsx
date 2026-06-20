import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, ChevronDown } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { getDashboardHome } from '../features/dashboard/api';

interface DangerSign {
  id: string;
  title: string;
  observe: string;
  action: string;
}

const DANGER_SIGNS: DangerSign[] = [
  { id: 'breathing', title: 'Breathing difficulty or fast breathing', observe: 'More than 60 breaths per minute, chest indrawing, grunting.', action: 'Take your baby to the hospital immediately.' },
  { id: 'cyanosis', title: 'Blue lips or fingertips (cyanosis)', observe: 'Bluish discoloration of lips, tongue, or fingertips.', action: 'This is an emergency. Go to the hospital now.' },
  { id: 'temperature', title: 'Abnormal temperature', observe: 'Temperature below 36.5°C or above 38°C.', action: 'Keep baby warm/cool and consult a doctor immediately.' },
  { id: 'feeding', title: 'Refusing to feed', observe: 'Baby refuses to feed or is unable to feed for several hours.', action: 'Seek medical help right away — this could indicate a serious problem.' },
  { id: 'lethargy', title: 'Lethargic, floppy, or unresponsive', observe: 'Baby is unusually sleepy, floppy, or hard to wake.', action: 'Go to the hospital immediately.' },
  { id: 'seizures', title: 'Convulsions or seizures', observe: 'Jerky, uncontrolled movements or stiffening of the body.', action: 'This is a medical emergency. Call for help immediately.' },
  { id: 'jaundice', title: 'Jaundice spreading below the navel', observe: 'Yellowing of skin spreading from the face down past the belly button.', action: 'Consult a doctor the same day.' },
  { id: 'fontanelle', title: 'Sunken fontanelle', observe: 'The soft spot on the head appears sunken in.', action: 'This may indicate dehydration — seek medical care promptly.' },
  { id: 'weight', title: 'Significant weight loss or no weight gain', observe: 'Baby is losing weight or not gaining weight over time.', action: 'Discuss with your healthcare provider at the next visit, or sooner if concerned.' },
  { id: 'cord', title: 'Redness or discharge from umbilical cord stump', observe: 'Redness, swelling, pus, or foul smell from the cord stump.', action: 'Consult a doctor — this could be a sign of infection.' },
];

export const DangerSigns: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState<string | null>(null);

  useEffect(() => {
    getDashboardHome()
      .then((res) => setEmergencyPhone(res.data.hospital?.emergencyPhone ?? null))
      .catch(() => setEmergencyPhone(null));
  }, []);

  const handleCall = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    if (emergencyPhone) {
      window.location.href = `tel:${emergencyPhone}`;
    }
    setConfirming(false);
  };

  return (
    <AppShell title={t('dangerSignsFull.title')} subtitle={t('dangerSignsFull.subtitle')}>
      <div className="space-y-3 pb-24">
        {DANGER_SIGNS.map((sign) => (
          <div key={sign.id} className="rounded-xl border border-border bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === sign.id ? null : sign.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-sm font-semibold text-text">{sign.title}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${expanded === sign.id ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {expanded === sign.id && (
              <div className="px-4 pb-4 space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase">{t('dangerSignsFull.observe')}</p>
                <p className="text-sm text-text">{sign.observe}</p>
                <p className="text-xs font-semibold text-text-muted uppercase mt-2">{t('dangerSignsFull.action')}</p>
                <p className="text-sm text-text">{sign.action}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 flex justify-center px-6">
        <button
          type="button"
          onClick={handleCall}
          disabled={!emergencyPhone}
          className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-4 text-white font-bold shadow-lg disabled:opacity-50"
        >
          {!confirming && <Phone className="h-4 w-4" aria-hidden="true" />}
          {confirming ? t('dangerSignsFull.confirmCall') : t('dangerSignsFull.callButton')}
        </button>
      </div>
    </AppShell>
  );
};
