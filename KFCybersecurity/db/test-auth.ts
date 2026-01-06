import 'dotenv/config';
import { db } from '../lib/db';
import { users } from '../lib/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

async function testAuth() {
  console.log('Testing authentication...\n');

  const email = 'admin@kfcyber.com';
  const password = 'admin123';

  try {
    // Fetch user
    console.log(`1. Looking up user: ${email}`);
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      password: users.password,
      name: users.name,
      role: users.role,
      clientId: users.clientId,
    }).from(users).where(eq(users.email, email));

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✓ User found:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  ClientId: ${user.clientId || 'null'}`);

    // Test password
    console.log(`\n2. Testing password...`);
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✓ Password is valid');
    } else {
      console.log('❌ Password is invalid');
    }

    // Simulate what would be returned in session
    console.log('\n3. Session data that would be returned:');
    console.log(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      clientName: undefined,
    }, null, 2));

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAuth()
  .finally(() => {
    process.exit(0);
  });
