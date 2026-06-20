import { describe, it, expect, beforeEach, vi } from 'vitest';
import type React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { Who5Assessment } from '../pages/assessments/Who5Assessment';
import { PsocAssessment } from '../pages/assessments/PsocAssessment';
import i18n from '../i18n';

const who5ApiMock = vi.hoisted(() => ({
  getWho5Status: vi.fn(),
  getWho5Questions: vi.fn(),
  getWho5Result: vi.fn(),
  submitWho5Assessment: vi.fn(),
}));

const psocApiMock = vi.hoisted(() => ({
  getPsocStatus: vi.fn(),
  getPsocQuestions: vi.fn(),
  getPsocResult: vi.fn(),
  submitPsocAssessment: vi.fn(),
}));

vi.mock('../features/assessments/who5/api', () => who5ApiMock);
vi.mock('../features/assessments/psoc/api', () => psocApiMock);

function authValue(): AuthContextValue {
  return {
    status: 'authenticated',
    user: { id: 'user-1', phone: '+919876543210', role: 'mother', preferredLanguage: 'en', hasPin: true },
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
  };
}

function renderPage(entry: string, element: React.ReactElement) {
  return render(
    <AuthContext.Provider value={authValue()}>
      <MemoryRouter initialEntries={[entry]}>
        {element}
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  void i18n.changeLanguage('en');
});

describe('Day 14 assessment pages', () => {
  it('does not call WHO-5 APIs for an invalid time point', () => {
    renderPage('/assessments/who5?timePoint=soon', <Who5Assessment />);
    expect(screen.getByText('Invalid assessment link')).toBeInTheDocument();
    expect(who5ApiMock.getWho5Status).not.toHaveBeenCalled();
  });

  it('shows content-not-ready for WHO-5', async () => {
    who5ApiMock.getWho5Status.mockResolvedValue({ submitted: false, locked: false, contentReady: false });
    who5ApiMock.getWho5Questions.mockResolvedValue({
      timePoint: 'baseline',
      contentReady: false,
      questions: Array.from({ length: 5 }, (_, index) => ({
        id: `q${index + 1}`,
        order: index + 1,
        text: `Question ${index + 1}`,
        contentStatus: 'approval_required',
      })),
      scale: [0, 1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) })),
    });

    renderPage('/assessments/who5?timePoint=baseline', <Who5Assessment />);
    expect(await screen.findByText('Content approval required')).toBeInTheDocument();
    expect(screen.queryByText('Submit assessment')).not.toBeInTheDocument();
  });

  it('shows content-not-ready for PSOC', async () => {
    psocApiMock.getPsocStatus.mockResolvedValue({ submitted: false, locked: false, contentReady: false });
    psocApiMock.getPsocQuestions.mockResolvedValue({
      timePoint: 'baseline',
      contentReady: false,
      questions: Array.from({ length: 17 }, (_, index) => ({
        id: `q${index + 1}`,
        order: index + 1,
        text: `Item ${index + 1}`,
        contentStatus: 'draft_from_prd_summary',
      })),
      scale: [1, 2, 3, 4, 5, 6].map((value) => ({ value, label: String(value) })),
    });

    renderPage('/assessments/psoc?timePoint=baseline', <PsocAssessment />);
    expect(await screen.findByText('Content approval required')).toBeInTheDocument();
    expect(screen.queryByText('Submit assessment')).not.toBeInTheDocument();
  });
});
