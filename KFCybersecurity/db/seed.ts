import 'dotenv/config';
import { db } from '../lib/db';
import { users, clients, services, deployments } from '../lib/schema';
import * as bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';

async function main() {
  console.log('Starting database seed...');

  // Create services
  const serviceData = [
    { id: 1, name: "Asset Mapper 360", vertical: "Identify", description: "Automated network discovery & inventory.", price: "$5/device" },
    { id: 2, name: "VulnScan Pro", vertical: "Identify", description: "Continuous vulnerability assessment.", price: "$150/mo" },
    { id: 3, name: "Sentinel Endpoint", vertical: "Protect", description: "NGAV & Ransomware rollback.", price: "$8/user" },
    { id: 4, name: "ZeroTrust Gateway", vertical: "Protect", description: "DNS filtering & ZTNA access.", price: "$6/user" },
    { id: 5, name: "EagleEye SIEM", vertical: "Detect", description: "24/7 Log aggregation & correlation.", price: "$500/mo" },
    { id: 6, name: "RapidResponse SOAR", vertical: "Respond", description: "Automated incident isolation scripts.", price: "$200/mo" },
    { id: 7, name: "CloudVault BDR", vertical: "Recover", description: "Immutable cloud backups.", price: "$0.10/GB" },
    { id: 8, name: "PhishSim Trainer", vertical: "Govern", description: "Employee awareness training.", price: "$2/user" }
  ];

  console.log('Creating services...');
  for (const service of serviceData) {
    const existing = await db.select().from(services).where(eq(services.id, service.id));
    if (existing.length === 0) {
      await db.insert(services).values(service);
    }
  }

  // Create clients
  const clientData = [
    { name: "Acme Corp", description: "Manufacturing company" },
    { name: "Globex Inc", description: "Technology services" },
    { name: "Soylent Corp", description: "Food and beverage" }
  ];

  console.log('Creating clients...');
  const createdClients = [];
  for (const clientInfo of clientData) {
    const existing = await db.select().from(clients).where(eq(clients.name, clientInfo.name));
    if (existing.length > 0) {
      createdClients.push(existing[0]);
    } else {
      const [client] = await db.insert(clients).values(clientInfo).returning();
      createdClients.push(client);
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  console.log('Creating admin user...');
  
  const [adminUser] = await db.select().from(users).where(eq(users.email, 'admin@kfcyber.com'));
  
  if (adminUser) {
    await db.update(users)
      .set({
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        clientId: null,
      })
      .where(eq(users.email, 'admin@kfcyber.com'));
  } else {
    await db.insert(users).values({
      email: 'admin@kfcyber.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    });
  }

  // Create client users
  const clientUsers = [
    { email: 'acme@example.com', name: 'Acme User', clientName: 'Acme Corp' },
    { email: 'globex@example.com', name: 'Globex User', clientName: 'Globex Inc' },
    { email: 'soylent@example.com', name: 'Soylent User', clientName: 'Soylent Corp' },
  ];

  console.log('Creating client users...');
  for (const userData of clientUsers) {
    const client = createdClients.find(c => c.name === userData.clientName);
    if (client) {
      const password = await bcrypt.hash('password123', 10);
      
      const [existingUser] = await db.select().from(users).where(eq(users.email, userData.email));
      
      if (existingUser) {
        await db.update(users)
          .set({
            password,
            name: userData.name,
            role: 'CLIENT',
            clientId: client.id,
          })
          .where(eq(users.email, userData.email));
      } else {
        await db.insert(users).values({
          email: userData.email,
          password,
          name: userData.name,
          role: 'CLIENT',
          clientId: client.id,
        });
      }
    }
  }

  // Create deployments
  const deploymentData = [
    { clientName: "Acme Corp", serviceIds: [1, 3, 5, 7] },
    { clientName: "Globex Inc", serviceIds: [3, 4] },
    { clientName: "Soylent Corp", serviceIds: [1, 2, 3, 4, 5, 6, 7, 8] }
  ];

  console.log('Creating deployments...');
  for (const deployment of deploymentData) {
    const client = createdClients.find(c => c.name === deployment.clientName);
    if (client) {
      for (const serviceId of deployment.serviceIds) {
        const existing = await db.select()
          .from(deployments)
          .where(
            sql`${deployments.clientId} = ${client.id} AND ${deployments.serviceId} = ${serviceId}`
          );
        
        if (existing.length === 0) {
          await db.insert(deployments).values({
            clientId: client.id,
            serviceId: serviceId,
          });
        }
      }
    }
  }

  console.log('Seed completed successfully!');
  console.log('\nDefault credentials:');
  console.log('Admin: admin@kfcyber.com / admin123');
  console.log('Acme Corp: acme@example.com / password123');
  console.log('Globex Inc: globex@example.com / password123');
  console.log('Soylent Corp: soylent@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
