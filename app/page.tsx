'use client';

import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';

const AVAILABLE_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation'];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setPage(1);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const query = new URLSearchParams({
        page: page.toString(),
        ...(search && { title: search }),
        ...(minYear && { minYear }),
        ...(maxYear && { maxYear }),
      });


      if (selectedGenres.length > 0) {
        query.append('genres', selectedGenres.join(','));
      }

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
  }, [search, minYear, maxYear, page, selectedGenres]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-col space-y-4">
        <div className="flex space-x-4 items-center">
          <input 
            type="text" 
            placeholder="Search movies by title..." 
            className="border p-2 rounded flex-1"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <input 
            type="number" 
            placeholder="Min Year" 
            className="border p-2 rounded w-24"
            value={minYear}
            onChange={(e) => { setMinYear(e.target.value); setPage(1); }}
          />
          <input 
            type="number" 
            placeholder="Max Year" 
            className="border p-2 rounded w-24"
            value={maxYear}
            onChange={(e) => { setMaxYear(e.target.value); setPage(1); }}
          />
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedGenres.includes(genre) 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow mt-6">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition"
        >
          Previous
        </button>
        <span className="font-bold">Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          disabled={movies.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
