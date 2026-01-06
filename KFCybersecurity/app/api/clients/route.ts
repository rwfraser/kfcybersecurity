import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients, deployments, users } from '@/lib/schema';
import { requireAuth, isAdmin } from '@/lib/api-auth';
import { sql, eq } from 'drizzle-orm';

// GET /api/clients - Get all clients (admin only)
export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await db.select({
      id: clients.id,
      name: clients.name,
      description: clients.description,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      deploymentCount: sql<number>`cast(count(distinct ${deployments.id}) as integer)`,
      userCount: sql<number>`cast(count(distinct ${users.id}) as integer)`,
    })
    .from(clients)
    .leftJoin(deployments, eq(clients.id, deployments.clientId))
    .leftJoin(users, eq(clients.id, users.clientId))
    .groupBy(clients.id)
    .orderBy(clients.name);

    // Transform to match Prisma format
    const clientsWithCounts = result.map(c => ({
      ...c,
      _count: {
        deployments: c.deploymentCount,
        users: c.userCount,
      },
      deploymentCount: undefined,
      userCount: undefined,
    }));

    return NextResponse.json(clientsWithCounts);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST /api/clients - Create new client (admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const [client] = await db.insert(clients)
      .values({ name, description })
      .returning();

    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return NextResponse.json({ error: 'Client name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
