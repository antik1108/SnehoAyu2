import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ClipboardList, TrendingUp, BookOpen, User } from 'lucide-react';
import { ROUTES } from '../../routes/paths';

const navItems = [
  { to: ROUTES.DASHBOARD, key: 'home', Icon: Home },
  { to: ROUTES.CHECKLIST, key: 'checklist', Icon: ClipboardList },
  { to: ROUTES.GROWTH, key: 'growth', Icon: TrendingUp },
  { to: ROUTES.LEARN, key: 'learn', Icon: BookOpen },
  { to: ROUTES.PROFILE, key: 'profile', Icon: User },
] as const;

export const BottomNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('dashboard.navigation.label', 'Main navigation')}
      className="sticky bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(15,23,42,0.04)]"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map(({ to, key, Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center text-xs font-medium leading-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isActive ? 'text-primary bg-primary/10' : 'text-text-muted',
              ].join(' ')
            }
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            <span>{t(`dashboard.navigation.${key}`, key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
