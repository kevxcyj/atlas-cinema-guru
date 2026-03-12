import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  try {
    
    const result = await pool.query('SELECT * FROM movies ORDER BY id DESC');
    
    return NextResponse.json({ 
      movies: result.rows 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching titles:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}