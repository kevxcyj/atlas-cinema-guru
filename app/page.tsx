'use client';

import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      const query = new URLSearchParams({
        page: page.toString(),
        ...(search && { title: search }),
        ...(minYear && { minYear }),
        ...(maxYear && { maxYear }),
      });

      try {
        const res = await fetch(`/api/titles?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMovies(data.movies || []); 
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };

    fetchMovies();
  }, [search, minYear, maxYear, page]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow flex space-x-4 items-center">
        <input 
          type="text" 
          placeholder="Search movies..." 
          className="border p-2 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Min Year" 
          className="border p-2 rounded w-24"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Max Year" 
          className="border p-2 rounded w-24"
          value={maxYear}
          onChange={(e) => setMaxYear(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded shadow mt-6">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="font-bold">Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

