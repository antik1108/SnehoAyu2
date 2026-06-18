import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/index.js';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  console.error('DATABASE_URL is required for seeding.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const primarySites = [
    {
      code: 'BNK',
      name: 'Bankura Medical College and Hospital',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'primary_site',
    },
    {
      code: 'BWN',
      name: 'Burdwan Medical College and Hospital',
      district: 'Purba Bardhaman',
      state: 'West Bengal',
      type: 'primary_site',
    },
  ];

  for (const site of primarySites) {
    await prisma.hospital.upsert({
      where: { code: site.code },
      update: {
        name: site.name,
        district: site.district,
        state: site.state,
        type: site.type,
      },
      create: {
        code: site.code,
        name: site.name,
        district: site.district,
        state: site.state,
        type: site.type,
        emergencyPhone: null,
        isActive: true,
        nextParticipantNumber: 1,
      },
    });
    console.log(`Seeded or verified hospital ${site.code}`);
  }

  console.log('Hospital seed completed');
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
