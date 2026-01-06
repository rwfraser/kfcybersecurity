import 'dotenv/config';
import { db } from '../lib/db';
import { users, clients } from '../lib/schema';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function createClientUsers() {
  console.log('Creating client users...\n');

  try {
    const clientUsers = [
      { email: 'acme@example.com', name: 'Acme User', clientName: 'Acme Corp' },
      { email: 'globex@example.com', name: 'Globex User', clientName: 'Globex Inc' },
      { email: 'soylent@example.com', name: 'Soylent User', clientName: 'Soylent Corp' },
    ];

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    for (const userData of clientUsers) {
      // Find the client
      const [client] = await db.select()
        .from(clients)
        .where(eq(clients.name, userData.clientName));

      if (!client) {
        console.log(`⚠️  Client "${userData.clientName}" not found, skipping ${userData.email}`);
        continue;
      }

      // Check if user already exists
      const [existing] = await db.select()
        .from(users)
        .where(eq(users.email, userData.email));

      if (existing) {
        console.log(`  - ${userData.email} already exists`);
        continue;
      }

      // Create user
      await db.insert(users).values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: 'CLIENT',
        clientId: client.id,
      });

      console.log(`  ✓ Created ${userData.email} for ${userData.clientName}`);
    }

    console.log('\n✅ Client users created successfully!');
    console.log('\nClient login credentials (all use same password):');
    console.log('Password: password123\n');
    console.log('Acme Corp:     acme@example.com');
    console.log('Globex Inc:    globex@example.com');
    console.log('Soylent Corp:  soylent@example.com');
  } catch (error) {
    console.error('❌ Error creating client users:', error);
    process.exit(1);
  }
}

createClientUsers()
  .finally(() => {
    process.exit(0);
  });
