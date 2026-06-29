import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/paths';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <span className="font-sans text-lg font-extrabold text-text">SnehoAyu Admin</span>
          <nav className="flex gap-1 rounded-full border border-border bg-surface p-1">
            <NavLink
              to={ROUTES.ADMIN_PARTICIPANTS}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors ${
                  isActive ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-primary/5'
                }`
              }
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Participants
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN_HOSPITALS}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors ${
                  isActive ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-primary/5'
                }`
              }
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Hospitals
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {user?.phone && <span className="text-sm text-text-muted">{user.phone}</span>}
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-sm font-bold text-text hover:bg-primary/5"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};
