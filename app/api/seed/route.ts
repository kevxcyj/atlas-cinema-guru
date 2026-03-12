import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western'
};

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDB_API_KEY is missing from your .env.local file!" }, 
        { status: 500 }
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "releaseYear" INTEGER,
        genres TEXT[],
        "imageUrl" TEXT
      );

      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        "userEmail" VARCHAR(255) NOT NULL,
        "movieId" INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        "movieTitle" VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL, 
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        "userEmail" VARCHAR(255) NOT NULL,
        "movieId" INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        UNIQUE("userEmail", "movieId")
      );

      CREATE TABLE IF NOT EXISTS watch_later (
        id SERIAL PRIMARY KEY,
        "userEmail" VARCHAR(255) NOT NULL,
        "movieId" INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        UNIQUE("userEmail", "movieId")
      );
    `);


    await pool.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE;');


    const allMovies = [];
    for (let page = 1; page <= 2; page++) {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`);
      const data = await res.json();
      
      if (data.results) {
        allMovies.push(...data.results);
      }
    }

 
    for (const movie of allMovies) {
    
      if (!movie.poster_path || !movie.release_date) continue;

      const title = movie.title;
      const description = movie.overview;
      const releaseYear = parseInt(movie.release_date.substring(0, 4));
      const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      
    
      const genres = movie.genre_ids.map((id: number) => TMDB_GENRE_MAP[id] || 'Other');

      await pool.query(
        `INSERT INTO movies (title, description, "releaseYear", genres, "imageUrl") 
         VALUES ($1, $2, $3, $4, $5)`,
        [title, description, releaseYear, genres, imageUrl]
      );
    }

    return NextResponse.json({ 
      message: `Database successfully seeded with ${allMovies.length} movies from TMDB!` 
    }, { status: 200 });

  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
