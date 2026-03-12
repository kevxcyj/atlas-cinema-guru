import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import pool from '../../../../lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ movieId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    
    const resolvedParams = await params;
    const movieId = parseInt(resolvedParams.movieId);
    
   
    await pool.query(`INSERT INTO watch_later ("userEmail", "movieId") VALUES ($1, $2) ON CONFLICT DO NOTHING`, [session.user.email, movieId]);
    

     const movieResult = await pool.query(`SELECT title FROM movies WHERE id = $1`, [movieId]);
    const title = movieResult.rows[0]?.title || 'Unknown Movie';
    await pool.query(`INSERT INTO activities ("userEmail", "movieId", "movieTitle", action) VALUES ($1, $2, $3, 'watch_later')`, [session.user.email, movieId, title]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ movieId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  
    const resolvedParams = await params;
    const movieId = parseInt(resolvedParams.movieId);

    await pool.query(`DELETE FROM watch_later WHERE "userEmail" = $1 AND "movieId" = $2`, [session.user.email, movieId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
