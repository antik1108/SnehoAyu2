import { getStoredLanguage } from '../../lib/authStorage';

export function formatDashboardDate(dateString: string): string {
  const language = getStoredLanguage() || 'bn';
  const date = new Date(`${dateString}T00:00:00Z`);

  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
