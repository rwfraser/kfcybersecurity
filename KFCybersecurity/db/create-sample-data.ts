import 'dotenv/config';
import { db } from '../lib/db';
import { clients, services } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function createSampleData() {
  console.log('Creating sample data...\n');

  try {
    // Create clients
    console.log('Creating clients...');
    const clientData = [
      { name: "Acme Corp", description: "Manufacturing company" },
      { name: "Globex Inc", description: "Technology services" },
      { name: "Soylent Corp", description: "Food and beverage" },
    ];

    for (const clientInfo of clientData) {
      const existing = await db.select().from(clients).where(eq(clients.name, clientInfo.name));
      if (existing.length === 0) {
        await db.insert(clients).values(clientInfo);
        console.log(`  ✓ Created ${clientInfo.name}`);
      } else {
        console.log(`  - ${clientInfo.name} already exists`);
      }
    }

    // Create services
    console.log('\nCreating services...');
    const serviceData = [
      { name: "Asset Mapper 360", vertical: "Identify", description: "Automated network discovery & inventory.", price: "$5/device" },
      { name: "VulnScan Pro", vertical: "Identify", description: "Continuous vulnerability assessment.", price: "$150/mo" },
      { name: "Sentinel Endpoint", vertical: "Protect", description: "NGAV & Ransomware rollback.", price: "$8/user" },
      { name: "ZeroTrust Gateway", vertical: "Protect", description: "DNS filtering & ZTNA access.", price: "$6/user" },
      { name: "EagleEye SIEM", vertical: "Detect", description: "24/7 Log aggregation & correlation.", price: "$500/mo" },
      { name: "RapidResponse SOAR", vertical: "Respond", description: "Automated incident isolation scripts.", price: "$200/mo" },
      { name: "CloudVault BDR", vertical: "Recover", description: "Immutable cloud backups.", price: "$0.10/GB" },
      { name: "PhishSim Trainer", vertical: "Govern", description: "Employee awareness training.", price: "$2/user" },
    ];

    const now = new Date();
    for (const service of serviceData) {
      const existing = await db.select().from(services).where(eq(services.name, service.name));
      if (existing.length === 0) {
        await db.insert(services).values({
          ...service,
          createdAt: now,
          updatedAt: now,
        });
        console.log(`  ✓ Created ${service.name}`);
      } else {
        console.log(`  - ${service.name} already exists`);
      }
    }

    console.log('\n✅ Sample data created successfully!');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData()
  .finally(() => {
    process.exit(0);
  });
