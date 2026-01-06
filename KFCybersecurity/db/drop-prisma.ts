import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log('Dropping _prisma_migrations table...');
  await sql`DROP TABLE IF EXISTS "_prisma_migrations" CASCADE`;
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end();
  });
