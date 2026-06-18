import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Welcome } from '../pages/Welcome';
import i18n from '../i18n';

describe('Welcome Page', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage('en');
  });

  const renderWelcome = () => {
    return render(
      <MemoryRouter initialEntries={['/welcome']}>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup/phone" element={<div>Signup Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/language-select" element={<div>Language Select Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders branding and feature highlights correctly in English', () => {
    renderWelcome();

    expect(screen.getByText('স্নেহআয়ু')).toBeInTheDocument();
    expect(screen.getByText('Supporting you and your baby after NICU discharge')).toBeInTheDocument();
    expect(screen.getByText('Daily Care Guide')).toBeInTheDocument();
    expect(screen.getByText('Growth Tracking')).toBeInTheDocument();
    expect(screen.getByText('Danger Signs')).toBeInTheDocument();
  });

  it('navigates to signup/phone when Create Account button is clicked', () => {
    renderWelcome();
    fireEvent.click(screen.getByText('Create Account'));
    expect(screen.getByText('Signup Page')).toBeInTheDocument();
  });

  it('navigates to login when Existing Account button is clicked', () => {
    renderWelcome();
    fireEvent.click(screen.getByText('I Already Have an Account'));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('navigates to language-select when Change Language link is clicked', () => {
    renderWelcome();
    fireEvent.click(screen.getByText('English / Change Language'));
    expect(screen.getByText('Language Select Page')).toBeInTheDocument();
  });
});
