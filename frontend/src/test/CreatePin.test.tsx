import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { CreatePin } from '../pages/CreatePin';
import i18n from '../i18n';

describe('CreatePin Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderCreatePin = (authValue: Partial<AuthContextValue> = {}) => {
    const defaultAuth: AuthContextValue = {
      status: 'authenticated',
      user: { id: '1', phone: '+919876543210', role: 'mother', preferredLanguage: 'en', hasPin: false },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      registerWithPassword: vi.fn(),
      loginWithPassword: vi.fn(),
      loginWithPin: vi.fn(),
      createPin: vi.fn(),
      refreshSession: vi.fn(),
      logout: vi.fn(),
      clearAuthError: vi.fn(),
      ...authValue,
    };

    return render(
      <AuthContext.Provider value={defaultAuth}>
        <MemoryRouter initialEntries={['/signup/create-pin']}>
          <Routes>
            <Route path="/signup/create-pin" element={<CreatePin />} />
            <Route path="/signup/mother-profile" element={<div>Mother Profile Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders initial setup headers and step info', () => {
    renderCreatePin();
    expect(screen.getByText('Create a 4-digit PIN')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
  });

  it('processes digit clicks and transitions to confirmation stage', async () => {
    renderCreatePin();

    // Tap 0, 5, 2, 7
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('7'));

    await waitFor(() => {
      expect(screen.getByText('Confirm your PIN')).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
    });
  });

  it('submits correctly on matching PIN confirmation', async () => {
    const createPinMock = vi.fn().mockResolvedValue(undefined);
    renderCreatePin({ createPin: createPinMock });

    // Step 1: 5, 8, 2, 3
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));

    await waitFor(() => {
      expect(screen.getByText('Confirm your PIN')).toBeInTheDocument();
    });

    // Step 2: 5, 8, 2, 3
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));

    await waitFor(() => {
      expect(createPinMock).toHaveBeenCalledWith('5823');
      expect(screen.getByText('Mother Profile Page')).toBeInTheDocument();
    });
  });

  it('resets step state and shows mismatch error on PIN mismatch', async () => {
    renderCreatePin();

    // Step 1: 5, 8, 2, 3
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));

    await waitFor(() => {
      expect(screen.getByText('Confirm your PIN')).toBeInTheDocument();
    });

    // Step 2: 5, 8, 2, 4 (mismatched)
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('4'));

    await waitFor(() => {
      expect(screen.getByText('The PINs do not match. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Create a 4-digit PIN')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
    });
  });

  it('blocks weak PIN entries (e.g. 1234)', async () => {
    renderCreatePin();

    // Tap 1, 2, 3, 4
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('4'));

    await waitFor(() => {
      expect(screen.getByText('This PIN is easy to guess.')).toBeInTheDocument();
      // Should remain on Step 1
      expect(screen.getByText('Create a 4-digit PIN')).toBeInTheDocument();
    });
  });

  it('supports physical keyboard input', async () => {
    renderCreatePin();

    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: '8' });
    fireEvent.keyDown(window, { key: '7' });
    // Backspace should pop last digit
    fireEvent.keyDown(window, { key: 'Backspace' });
    fireEvent.keyDown(window, { key: '6' });
    fireEvent.keyDown(window, { key: '5' });

    await waitFor(() => {
      expect(screen.getByText('Confirm your PIN')).toBeInTheDocument();
    });
  });
});
