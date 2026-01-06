import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deployments, services, clients } from '@/lib/schema';
import { requireAuth, isAdmin } from '@/lib/api-auth';
import { eq, and, desc } from 'drizzle-orm';

// GET /api/deployments - Get deployments (filtered by role)
export async function GET(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  try {
    // Admin can view all deployments or filter by clientId
    // Client users can only view their own deployments
    let query = db.select({
      id: deployments.id,
      clientId: deployments.clientId,
      serviceId: deployments.serviceId,
      createdAt: deployments.createdAt,
      updatedAt: deployments.updatedAt,
      service: services,
      client: clients,
    })
    .from(deployments)
    .leftJoin(services, eq(deployments.serviceId, services.id))
    .leftJoin(clients, eq(deployments.clientId, clients.id))
    .orderBy(desc(deployments.createdAt));
    
    // Apply filters based on user role
    if (isAdmin(user)) {
      if (clientId) {
        query = query.where(eq(deployments.clientId, clientId)) as typeof query;
      }
    } else {
      // Client users can only see their own deployments
      if (!user.clientId) {
        return NextResponse.json({ error: 'Client ID not found' }, { status: 400 });
      }
      query = query.where(eq(deployments.clientId, user.clientId)) as typeof query;
    }

    const result = await query;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json({ error: 'Failed to fetch deployments' }, { status: 500 });
  }
}

// POST /api/deployments - Deploy a service to a client
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { clientId, serviceId } = body;

    if (!clientId || !serviceId) {
      return NextResponse.json({ error: 'clientId and serviceId are required' }, { status: 400 });
    }

    // Admin can deploy to any client, client users can only deploy to their own account
    if (!isAdmin(user) && user.clientId !== clientId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if deployment already exists
    const existing = await db.select()
      .from(deployments)
      .where(
        and(
          eq(deployments.clientId, clientId),
          eq(deployments.serviceId, parseInt(serviceId))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Service already deployed' }, { status: 409 });
    }

    const [deployment] = await db.insert(deployments)
      .values({
        clientId,
        serviceId: parseInt(serviceId)
      })
      .returning();

    // Fetch related data
    const [deploymentWithRelations] = await db.select({
      id: deployments.id,
      clientId: deployments.clientId,
      serviceId: deployments.serviceId,
      createdAt: deployments.createdAt,
      updatedAt: deployments.updatedAt,
      service: services,
      client: clients,
    })
    .from(deployments)
    .leftJoin(services, eq(deployments.serviceId, services.id))
    .leftJoin(clients, eq(deployments.clientId, clients.id))
    .where(eq(deployments.id, deployment.id));

    return NextResponse.json(deploymentWithRelations, { status: 201 });
  } catch (error) {
    console.error('Error creating deployment:', error);
    return NextResponse.json({ error: 'Failed to create deployment' }, { status: 500 });
  }
}

// DELETE /api/deployments - Remove a deployment
export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const serviceId = searchParams.get('serviceId');

    if (!clientId || !serviceId) {
      return NextResponse.json({ error: 'clientId and serviceId are required' }, { status: 400 });
    }

    // Admin can remove any deployment, client users can only remove from their own account
    if (!isAdmin(user) && user.clientId !== clientId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(deployments)
      .where(
        and(
          eq(deployments.clientId, clientId),
          eq(deployments.serviceId, parseInt(serviceId))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deployment:', error);
    return NextResponse.json({ error: 'Failed to delete deployment' }, { status: 500 });
  }
}
