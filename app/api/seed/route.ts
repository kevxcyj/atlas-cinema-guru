import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "releaseYear" INTEGER,
        genres TEXT[],
        "imageUrl" TEXT
      );
    `);


    await pool.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE;');

    const seedQuery = `
      INSERT INTO movies (title, description, "releaseYear", genres, "imageUrl")
      VALUES 
        ('Spider-Man: Into the Spider-Verse', 'Teen Miles Morales becomes the Spider-Man of his universe.', 2018, ARRAY['Action', 'Animation', 'Sci-Fi'], 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg'),
        ('Black Panther', 'T''Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.', 2018, ARRAY['Action', 'Adventure', 'Sci-Fi'], 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg'),
        ('Shin Kamen Rider', 'A man gets transformed into a cyborg mutant by a sinister organization and turns against them.', 2023, ARRAY['Action', 'Sci-Fi'], 'https://image.tmdb.org/t/p/w500/9yZixEvOAAfI9IqO0NksW28cK0o.jpg')
    `;
    
    await pool.query(seedQuery);

    return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
