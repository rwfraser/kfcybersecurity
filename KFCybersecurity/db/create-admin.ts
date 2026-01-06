import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/schema';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  console.log('Creating admin user...');

  try {
    // Check if admin already exists
    const [existing] = await db.select()
      .from(users)
      .where(eq(users.email, 'admin@kfcyber.com'));

    if (existing) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    const [admin] = await db.insert(users)
      .values({
        email: 'admin@kfcyber.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        clientId: null,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@kfcyber.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin()
  .finally(() => {
    process.exit(0);
  });
