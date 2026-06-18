import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageSelect } from '../pages/LanguageSelect';
import i18n from '../i18n';
import { getStoredLanguage } from '../lib/authStorage';

describe('LanguageSelect', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage('bn');
  });

  it('renders language choices correctly', () => {
    render(
      <MemoryRouter>
        <LanguageSelect />
      </MemoryRouter>
    );

    expect(screen.getByText('বাংলা')).toBeInTheDocument();
    expect(screen.getByText('हिंदी')).toBeInTheDocument();
    expect(screen.getAllByText('English')[0]).toBeInTheDocument();
  });

  it('sets stored language, changes translation language, and redirects when clicked', async () => {
    const changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');

    render(
      <MemoryRouter initialEntries={['/language-select']}>
        <Routes>
          <Route path="/language-select" element={<LanguageSelect />} />
          <Route path="/welcome" element={<div data-testid="welcome-page">Welcome!</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('English')[0]);

    await waitFor(() => {
      expect(getStoredLanguage()).toBe('en');
      expect(changeLanguageSpy).toHaveBeenCalledWith('en');
      expect(document.documentElement.lang).toBe('en');
      expect(screen.getByTestId('welcome-page')).toBeInTheDocument();
    });

    changeLanguageSpy.mockRestore();
  });
});
