import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT m.* FROM movies m 
       INNER JOIN favorites f ON m.id = f."movieId" 
       WHERE f."userEmail" = $1 
       ORDER BY f.id DESC LIMIT $2 OFFSET $3`,
      [session.user.email, limit, offset]
    );

    return NextResponse.json({ movies: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}
