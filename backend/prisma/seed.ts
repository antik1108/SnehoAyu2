import pg from 'pg';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/index.js';
import { formatParticipantCode, type StudyGroup } from '../src/utils/participantCode.js';
import { calculateBirthWeightStratum } from '../src/validators/onboardingValidator.js';
import { addUtcDays } from '../src/utils/dateOnly.js';
import { learningHubContent } from '../../frontend/src/content/learningHubContent.js';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  console.error('DATABASE_URL is required for seeding.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TEST_PASSWORD = 'TestPass123';
const BCRYPT_ROUNDS = Number(process.env['BCRYPT_PASSWORD_ROUNDS'] ?? 12);

const HOSPITALS = [
  { code: 'BNK', name: 'Bankura Medical College and Hospital', district: 'Bankura', state: 'West Bengal', type: 'primary_site' },
  { code: 'BWN', name: 'Burdwan Medical College and Hospital', district: 'Purba Bardhaman', state: 'West Bengal', type: 'primary_site' },
  { code: 'DBN', name: 'Deban Mahato Medical College and Hospital', district: 'Purulia', state: 'West Bengal', type: 'pilot_site' },
] as const;

const ADMINS = [
  { phone: '+919000000001', fullName: 'Purnima Chakrabortty', designation: 'Principal Investigator', email: 'purnima.chakrabortty@snehoayu.dev' },
  { phone: '+919000000003', fullName: 'Ananya Sengupta', designation: 'Co-Investigator', email: 'ananya.sengupta@snehoayu.dev' },
  { phone: '+919000000004', fullName: 'Rajiv Banerjee', designation: 'Research Coordinator', email: 'rajiv.banerjee@snehoayu.dev' },
] as const;

const NURSE_NAMES = [
  'Mousumi Halder', 'Sangeeta Roy', 'Tapasi Mondal',
  'Ruma Das', 'Shibani Ghosh', 'Kakoli Pal',
  'Sumitra Adhikari', 'Bandana Saha', 'Nilima Bagchi',
] as const;

const MOTHER_FIRST_NAMES = [
  'Priya', 'Anita', 'Sushmita', 'Mamoni', 'Rina', 'Lakshmi', 'Sabita', 'Mitali',
  'Chandana', 'Putul', 'Rupali', 'Doli', 'Kajal', 'Madhumita', 'Sefali', 'Bithi',
  'Jharna', 'Shipra', 'Tanima', 'Ranjana', 'Aparna', 'Krishna', 'Pushpa', 'Malati',
] as const;

const BABY_NAMES = [
  'Arnab', 'Riya', 'Sohini', 'Debu', 'Tiya', 'Arjun', 'Mou', 'Pritam',
  'Ishita', 'Avik', 'Snigdha', 'Rohit', 'Payel', 'Subho', 'Diya', 'Arka',
  'Megha', 'Sayan', 'Nandini', 'Biplab', 'Trisha', 'Joy', 'Ankita', 'Rudra',
] as const;

async function main() {
  // ── Hospitals (1 pilot + 2 primary, per PRD) ───────────────────────────
  for (const site of HOSPITALS) {
    await prisma.hospital.upsert({
      where: { code: site.code },
      update: { name: site.name, district: site.district, state: site.state, type: site.type },
      create: {
        code: site.code,
        name: site.name,
        district: site.district,
        state: site.state,
        type: site.type,
        emergencyPhone: '+913340000000',
        isActive: true,
        nextParticipantNumber: 1,
      },
    });
    console.log(`Seeded or verified hospital ${site.code}`);
  }

  const hospitals = await prisma.hospital.findMany({ where: { code: { in: HOSPITALS.map((h) => h.code) } } });
  const hospitalByCode = new Map(hospitals.map((h) => [h.code, h]));
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, BCRYPT_ROUNDS);

  // ── Researchers / admins (1-3 — assign study groups, manage hospitals) ──
  for (const admin of ADMINS) {
    const user = await prisma.user.upsert({
      where: { phone: admin.phone },
      update: { passwordHash, role: 'researcher', isActive: true },
      create: { phone: admin.phone, passwordHash, role: 'researcher', preferredLanguage: 'en' },
    });
    await prisma.researcherProfile.upsert({
      where: { userId: user.id },
      update: { fullName: admin.fullName, designation: admin.designation, email: admin.email },
      create: { userId: user.id, fullName: admin.fullName, designation: admin.designation, email: admin.email, accessLevel: 'full' },
    });
  }
  console.log(`Seeded ${ADMINS.length} researcher/admin accounts (phones +919000000001, 03, 04). Password: ${TEST_PASSWORD}`);

  // ── Nurses — 3 per hospital, enrol mothers at their assigned site ───────
  let nursePhoneSeq = 1001;
  let nurseIndex = 0;
  for (const site of HOSPITALS) {
    const hospital = hospitalByCode.get(site.code)!;
    for (let i = 0; i < 3; i++) {
      const phone = `+91900000${nursePhoneSeq++}`;
      const fullName = NURSE_NAMES[nurseIndex++];
      const user = await prisma.user.upsert({
        where: { phone },
        update: { passwordHash, role: 'nurse', isActive: true, hospitalId: hospital.id },
        create: { phone, passwordHash, role: 'nurse', preferredLanguage: 'bn', hospitalId: hospital.id },
      });
      await prisma.nurseProfile.upsert({
        where: { userId: user.id },
        update: { fullName, hospitalId: hospital.id },
        create: { userId: user.id, hospitalId: hospital.id, fullName, employeeId: `NURSE-${String(nurseIndex).padStart(3, '0')}` },
      });
    }
  }
  console.log(`Seeded ${nurseIndex} nurse accounts (phones +919000001001-${nursePhoneSeq - 1}). Password: ${TEST_PASSWORD}`);

  // ── Mother participants — 8 per hospital, 24 total, fully onboarded ────
  const ageRanges = ['18_25', '26_30', '31_35'] as const;
  const educationLevels = ['secondary', 'higher_secondary', 'graduate'] as const;
  const occupationsM = ['homemaker', 'private_service', 'daily_labour'] as const;
  const occupationsF = ['govt_service', 'private_service', 'daily_labour'] as const;
  const incomeClasses = ['II', 'III', 'IV'] as const;
  const familyTypes = ['nuclear', 'joint'] as const;
  const religions = ['hindu', 'muslim'] as const;
  const residences = ['rural', 'semi_urban', 'urban'] as const;
  const feedingTypes = ['exclusive_bf', 'mixed'] as const;

  let motherPhoneSeq = 2001;
  let nameIndex = 0;
  let totalSeeded = 0;
  const today = new Date();

  for (const site of HOSPITALS) {
    const hospital = hospitalByCode.get(site.code)!;
    let sequence = hospital.nextParticipantNumber;

    for (let i = 0; i < 8; i++) {
      const idx = nameIndex++;
      const phone = `+91900000${motherPhoneSeq++}`;
      const studyGroup: StudyGroup = idx % 2 === 0 ? 'study' : 'control';
      const fullName = `${MOTHER_FIRST_NAMES[idx % MOTHER_FIRST_NAMES.length]} Devi`;
      const babyName = BABY_NAMES[idx % BABY_NAMES.length];
      const sex = idx % 2 === 0 ? 'male' : 'female';
      const gestationalAgeWeeks = 28 + (idx % 9); // 28-36 weeks
      const birthWeightGrams = 900 + (idx % 6) * 350; // spreads across all 3 strata
      const nicuStayDays = 10 + (idx % 20);
      const dischargeDate = addUtcDays(today, -(30 + idx)); // discharged 30-57 days ago
      const dateOfBirth = addUtcDays(dischargeDate, -nicuStayDays);

      const mu = await prisma.user.upsert({
        where: { phone },
        update: { passwordHash, role: 'mother', isActive: true, hospitalId: hospital.id },
        create: { phone, passwordHash, role: 'mother', preferredLanguage: 'bn', hospitalId: hospital.id },
      });

      const participantCode = formatParticipantCode(hospital.code, studyGroup, sequence);
      sequence += 1;

      const mp = await prisma.motherProfile.upsert({
        where: { userId: mu.id },
        update: {},
        create: {
          userId: mu.id,
          participantCode,
          studyGroup,
          hospitalId: hospital.id,
          fullName,
          ageRange: ageRanges[idx % ageRanges.length],
          educationMother: educationLevels[idx % educationLevels.length],
          educationFather: educationLevels[(idx + 1) % educationLevels.length],
          occupationMother: occupationsM[idx % occupationsM.length],
          occupationFather: occupationsF[idx % occupationsF.length],
          incomeClass: incomeClasses[idx % incomeClasses.length],
          familyType: familyTypes[idx % familyTypes.length],
          familyMembersCount: String(3 + (idx % 4)),
          religion: religions[idx % religions.length],
          residenceType: residences[idx % residences.length],
          prevPretermEducation: idx % 2 === 0,
          educationSource: idx % 2 === 0 ? ['health_worker'] : [],
          enrolledAt: dischargeDate,
          onboardingCompletedAt: dischargeDate,
        },
      });

      const birthWeightStratum = calculateBirthWeightStratum(birthWeightGrams);

      await prisma.babyProfile.upsert({
        where: { motherProfileId: mp.id },
        update: {},
        create: {
          motherProfileId: mp.id,
          babyName,
          sex,
          dateOfBirth,
          gestationalAgeWeeks,
          birthWeightGrams,
          weightAtDischargeGrams: birthWeightGrams + 300 + (idx % 5) * 50,
          placeOfDelivery: 'hospital',
          nicuStayDays,
          skinToSkinAtBirth: idx % 2 === 0,
          kmcInNicu: idx % 3 !== 0,
          feedingAtDischarge: feedingTypes[idx % feedingTypes.length],
          criedAtBirth: idx % 4 !== 0,
          neededResuscitation: idx % 4 === 0,
          birthWeightStratum,
          dischargeDate,
        },
      });

      const followUps: Array<{ timePoint: string; days: number }> = [
        { timePoint: 'baseline', days: 0 },
        { timePoint: '1_month', days: 30 },
        { timePoint: '3_months', days: 90 },
        { timePoint: '6_months', days: 180 },
      ];
      for (const fu of followUps) {
        await prisma.followUpSchedule.upsert({
          where: { motherProfileId_timePoint: { motherProfileId: mp.id, timePoint: fu.timePoint } },
          update: {},
          create: {
            motherProfileId: mp.id,
            timePoint: fu.timePoint,
            scheduledDate: addUtcDays(dischargeDate, fu.days),
            status: fu.timePoint === 'baseline' ? 'completed' : 'pending',
            actualDate: fu.timePoint === 'baseline' ? dischargeDate : null,
            dataComplete: fu.timePoint === 'baseline',
          },
        });
      }

      totalSeeded += 1;
    }

    await prisma.hospital.update({ where: { id: hospital.id }, data: { nextParticipantNumber: sequence } });
  }

  console.log(`Seeded ${totalSeeded} mother participants across ${HOSPITALS.length} hospitals (phones +919000002001-${motherPhoneSeq - 1}). Password: ${TEST_PASSWORD}`);

  // ── Learning Articles — seed all articles from learningHubContent.ts ───────
  // Use the first researcher/admin as the authorId for seeded articles
  const seedAuthor = await prisma.user.findFirst({
    where: { role: 'researcher' },
    select: { id: true },
  });

  if (!seedAuthor) {
    console.warn('No researcher user found; skipping learning article seed. Run seed after researcher accounts are created.');
  } else {
    let articlesSeeded = 0;
    for (const item of learningHubContent) {
      await prisma.learningArticle.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          body: item.body,
          summary: item.summary ?? null,
          category: item.category,
          audioUrl: item.audioUrl ?? null,
          status: 'published',
          publishedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
        create: {
          slug: item.slug,
          title: item.title,
          body: item.body,
          summary: item.summary ?? null,
          category: item.category,
          tags: [],
          imageUrls: [],
          audioUrl: item.audioUrl ?? null,
          videoUrl: null,
          coverImageUrl: null,
          status: 'published',
          publishedAt: new Date('2025-01-01T00:00:00.000Z'),
          authorId: seedAuthor.id,
        },
      });
      articlesSeeded += 1;
    }
    console.log(`Seeded ${articlesSeeded} learning articles (with summary) from learningHubContent.`);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
