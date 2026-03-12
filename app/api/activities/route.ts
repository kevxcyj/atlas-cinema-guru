import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, action, "movieTitle", "createdAt" 
       FROM activities 
       WHERE "userEmail" = $1 
       ORDER BY "createdAt" DESC 
       LIMIT 10`,
      [session.user.email]
    );

    return NextResponse.json({ activities: result.rows });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
