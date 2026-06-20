import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import i18n from '../i18n';

describe('BottomNavigation', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('preferred_language', 'en');
    void i18n.changeLanguage('en');
  });

  it('renders all nav items and marks the current route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Checklist')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
