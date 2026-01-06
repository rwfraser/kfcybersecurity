import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function getAuthUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return user;
}

export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  return user;
}

export function isAdmin(user: { role: string }) {
  return user.role === 'ADMIN';
}
