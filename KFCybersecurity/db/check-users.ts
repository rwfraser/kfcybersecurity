import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function check() {
  console.log('Checking users in database...\n');

  try {
    const allUsers = await db.select().from(users);
    console.log(`Total users: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log('❌ No users found in database. You need to run the seed script.');
    } else {
      console.log('Users found:');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.role}) - ID: ${u.id}`);
      });

      // Check specifically for admin
      const [admin] = await db.select()
        .from(users)
        .where(eq(users.email, 'admin@kfcyber.com'));
      
      if (admin) {
        console.log('\n✓ Admin user exists');
        console.log(`  Email: ${admin.email}`);
        console.log(`  Name: ${admin.name}`);
        console.log(`  Role: ${admin.role}`);
      } else {
        console.log('\n❌ Admin user NOT found');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

check()
  .finally(() => {
    process.exit(0);
  });
