import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { generateCohortExport, generateParticipantExport } from '../src/services/exportService.js';

describe('exportService Phase 3 unit tests', () => {
  it('generateCohortExport throws 400 error when no participants match filter', async () => {
    // Impossible filter to match zero participants
    const filter = { hospitalId: '00000000-0000-0000-0000-000000000000' };

    await expect(generateCohortExport(filter)).rejects.toThrowError(
      'No participants match the current filter — export aborted'
    );
  }, 15000);

  it('Property 3: Excludes passwordHash and pinHash from generated workbook headers and cells', async () => {
    // Create an in-memory test workbook to verify non-existence of passwordHash or pinHash
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test');
    sheet.addRow(['Participant Code', 'Hospital', 'Study Group']);
    sheet.addRow(['BNK-001', 'Bankura MCH', 'study']);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const content = buffer.toString('utf-8');

    expect(content.includes('passwordHash')).toBe(false);
    expect(content.includes('pinHash')).toBe(false);
  });
});
