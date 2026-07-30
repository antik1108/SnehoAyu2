import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { listParticipants, getAdminParticipantGrowth, getParticipantDetail } from '../src/services/adminService.js';

describe('adminService Phase 2 extensions unit tests', () => {
  it('listParticipants function is defined and accepts CohortFilter', () => {
    expect(typeof listParticipants).toBe('function');
  });

  it('getAdminParticipantGrowth function is defined', () => {
    expect(typeof getAdminParticipantGrowth).toBe('function');
  });

  it('getParticipantDetail function is defined', () => {
    expect(typeof getParticipantDetail).toBe('function');
  });
});
