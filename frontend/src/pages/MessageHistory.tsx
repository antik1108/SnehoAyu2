import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../components/layout/AppShell';
import { getMessageHistory, type MessageHistoryItem } from '../features/messages/api';

export const MessageHistory: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<MessageHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessageHistory()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title={t('messageHistory.title')} subtitle={t('messageHistory.subtitle')}>
      {loading ? (
        <div className="py-12 text-center text-sm text-text-muted">{t('messageHistory.loading')}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">{t('messageHistory.empty')}</div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-text">{item.text}</p>
              <p className="mt-1 text-xs text-text-muted">{new Date(item.deliveredAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
};
