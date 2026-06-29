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
      className="sticky bottom-0 z-20 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(24,23,21,0.08)] backdrop-blur-xl lg:fixed lg:bottom-6 lg:left-6 lg:top-6 lg:w-56 lg:rounded-[24px] lg:border lg:bg-[#111] lg:p-4 lg:shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2 lg:flex lg:h-full lg:flex-col lg:gap-2 lg:p-0">
        <div className="mb-7 hidden px-3 pt-2 lg:block">
          <p className="text-2xl font-extrabold text-white">SnehoAyu</p>
          <p className="mt-1 text-xs font-bold text-white/45">Mother care app</p>
        </div>
        {navItems.map(({ to, key, Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center text-xs font-bold leading-4 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-12 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-left lg:text-sm',
                isActive ? 'bg-secondary text-primary lg:text-[#111]' : 'text-text-muted hover:bg-primary/5 lg:text-white/62 lg:hover:translate-x-1 lg:hover:bg-white/10 lg:hover:text-white',
              ].join(' ')
            }
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
            <span>{t(`dashboard.navigation.${key}`, key)}</span>
          </NavLink>
        ))}
        <div className="mt-auto hidden rounded-2xl bg-white/8 p-3 text-xs font-bold leading-5 text-white/55 lg:block">
          <span className="block text-white">Daily care</span>
          Track feeding, KMC, growth and learning in one place.
        </div>
      </div>
    </nav>
  );
};
