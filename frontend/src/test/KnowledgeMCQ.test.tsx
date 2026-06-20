import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { KnowledgeMCQ } from '../pages/assessments/KnowledgeMCQ';
import type { KnowledgeQuestionsResponse, KnowledgeStatus } from '../features/assessments/knowledge/types';
import i18n from '../i18n';

const apiMock = vi.hoisted(() => ({
  getKnowledgeStatus: vi.fn(),
  getKnowledgeQuestions: vi.fn(),
  getKnowledgeSubmission: vi.fn(),
  submitKnowledgeAssessment: vi.fn(),
}));

vi.mock('../features/assessments/knowledge/api', () => apiMock);

function renderPage(initialEntry: string) {
  const authValue: AuthContextValue = {
    status: 'authenticated',
    user: {
      id: 'user-1',
      phone: '+919876543210',
      role: 'mother',
      preferredLanguage: 'en',
      hasPin: true,
    },
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

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <KnowledgeMCQ />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  void i18n.changeLanguage('en');
});

describe('KnowledgeMCQ page', () => {
  it('shows a safe error when timePoint is missing or invalid', () => {
    renderPage('/assessments/knowledge?timePoint=tomorrow');

    expect(screen.getByText('Invalid assessment link')).toBeInTheDocument();
    expect(apiMock.getKnowledgeStatus).not.toHaveBeenCalled();
  });

  it('shows approval-required state when backend content is not ready', async () => {
    const status: KnowledgeStatus = {
      timePoint: 'baseline',
      available: true,
      submitted: false,
      locked: false,
      score: null,
      maxScore: 15,
      percentage: null,
      grade: null,
      submittedAt: null,
      contentReady: false,
    };
    const questions: KnowledgeQuestionsResponse = {
      timePoint: 'baseline',
      contentReady: false,
      questions: Array.from({ length: 15 }, (_, index) => ({
        id: `q${index + 1}` as KnowledgeQuestionsResponse['questions'][number]['id'],
        order: index + 1,
        topic: `Topic ${index + 1}`,
        text: `Topic ${index + 1}`,
        contentStatus: 'approval_required',
        options: [],
      })),
    };

    apiMock.getKnowledgeStatus.mockResolvedValue(status);
    apiMock.getKnowledgeQuestions.mockResolvedValue(questions);

    renderPage('/assessments/knowledge?timePoint=baseline');

    expect(await screen.findByText('Content approval required')).toBeInTheDocument();
    expect(screen.getByText(/Tool III is not ready/i)).toBeInTheDocument();
    expect(screen.queryByText('Submit and lock')).not.toBeInTheDocument();
  });
});
