import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const title = searchParams.get('title');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    
    const limit = 12; // Movies per page
    const offset = (page - 1) * limit;

    let queryText = 'SELECT * FROM movies WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;
    
    if (title) {
      queryText += ` AND title ILIKE $${paramIndex}`;
      queryParams.push(`%${title}%`);
      paramIndex++;
    }
    
    if (minYear) {
      queryText += ` AND "releaseYear" >= $${paramIndex}`;
      queryParams.push(parseInt(minYear));
      paramIndex++;
    }

    if (maxYear) {
      queryText += ` AND "releaseYear" <= $${paramIndex}`;
      queryParams.push(parseInt(maxYear));
      paramIndex++;
    }

    queryText += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(queryText, queryParams);
    
    return NextResponse.json({ movies: result.rows }, { status: 200 });

  } catch (error) {
    console.error("Error fetching titles:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
