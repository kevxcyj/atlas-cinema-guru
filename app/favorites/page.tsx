'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`/api/favorites?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies || []); 
      }
    } catch (error) {
      console.error("Failed to fetch favorites", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Favorites</h2>

      {movies.length === 0 ? (
        <p className="text-gray-600">You haven't added any movies to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie: any) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onActivityUpdate={fetchFavorites} // Refreshes the list if a user unfavorites a movie
            />
          ))}
        </div>
      )}

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
