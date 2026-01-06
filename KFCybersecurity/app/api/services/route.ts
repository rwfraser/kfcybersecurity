import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/schema';
import { requireAuth, isAdmin } from '@/lib/api-auth';

// GET /api/services - Get all services (authenticated users)
export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const allServices = await db.select()
      .from(services)
      .orderBy(services.id);

    return NextResponse.json(allServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, vertical, description, price } = body;

    if (!name || !vertical || !description || !price) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const [service] = await db.insert(services)
      .values({ name, vertical, description, price })
      .returning();

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return NextResponse.json({ error: 'Service name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
