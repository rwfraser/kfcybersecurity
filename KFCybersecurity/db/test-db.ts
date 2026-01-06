import 'dotenv/config';
import { db } from '../lib/db';
import { users, clients, services, deployments } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function test() {
  console.log('Testing Drizzle database operations...\n');

  try {
    // Test 1: Query services
    console.log('1. Querying all services...');
    const allServices = await db.select().from(services);
    console.log(`✓ Found ${allServices.length} services`);

    // Test 2: Query clients
    console.log('\n2. Querying all clients...');
    const allClients = await db.select().from(clients);
    console.log(`✓ Found ${allClients.length} clients`);

    // Test 3: Query users
    console.log('\n3. Querying all users...');
    const allUsers = await db.select().from(users);
    console.log(`✓ Found ${allUsers.length} users`);

    // Test 4: Query with where clause
    console.log('\n4. Querying admin user...');
    const [admin] = await db.select()
      .from(users)
      .where(eq(users.email, 'admin@kfcyber.com'));
    if (admin) {
      console.log(`✓ Found admin: ${admin.name} (${admin.email})`);
    }

    // Test 5: Query deployments with joins
    console.log('\n5. Querying deployments with joins...');
    const deploymentsWithRelations = await db.select({
      id: deployments.id,
      client: clients,
      service: services,
    })
    .from(deployments)
    .leftJoin(clients, eq(deployments.clientId, clients.id))
    .leftJoin(services, eq(deployments.serviceId, services.id))
    .limit(3);
    console.log(`✓ Found deployments with relations, showing first 3:`);
    deploymentsWithRelations.forEach(d => {
      console.log(`  - ${d.client?.name} → ${d.service?.name}`);
    });

    console.log('\n✅ All database operations working correctly with Drizzle!');
  } catch (error) {
    console.error('\n❌ Error testing database:', error);
    process.exit(1);
  }
}

test()
  .finally(() => {
    process.exit(0);
  });
