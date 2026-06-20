import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../routes/paths';

const navItems = [
  { to: ROUTES.DASHBOARD, key: 'home' },
  { to: ROUTES.CHECKLIST, key: 'checklist' },
  { to: ROUTES.GROWTH, key: 'growth' },
  { to: ROUTES.LEARN, key: 'learn' },
  { to: ROUTES.PROFILE, key: 'profile' },
] as const;

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('dashboard.navigation.label', 'Main navigation')}
      className="sticky bottom-0 z-20 border-t border-border bg-surface/100 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-2 text-center text-xs font-medium leading-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isActive ? 'text-primary bg-primary/5' : 'text-text-muted',
              ].join(' ')
            }
          >
            <span>{t(`dashboard.navigation.${item.key}`, item.key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
