import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/paths';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-sans text-base font-bold text-primary">SnehoAyu Admin</span>
          <nav className="flex gap-1">
            <NavLink
              to={ROUTES.ADMIN_PARTICIPANTS}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-slate-50'
                }`
              }
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Participants
            </NavLink>
            <NavLink
              to={ROUTES.ADMIN_HOSPITALS}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-slate-50'
                }`
              }
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Hospitals
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user?.phone && <span className="text-sm text-text-muted">{user.phone}</span>}
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};
