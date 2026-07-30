import React from 'react';
import { FilterContextProvider } from '../../features/admin/FilterContext';
import { CohortOverview } from '../../components/admin/CohortOverview';
import { ParticipantList } from './ParticipantList';

export const ParticipantsPageContent: React.FC = () => {
  return (
    <div>
      <CohortOverview />
      <ParticipantList />
    </div>
  );
};

export const ParticipantsPage: React.FC = () => {
  return (
    <FilterContextProvider>
      <ParticipantsPageContent />
    </FilterContextProvider>
  );
};
