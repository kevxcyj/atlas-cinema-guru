'use client';

import { useState } from 'react';
import { FaStar, FaRegStar, FaClock, FaRegClock } from 'react-icons/fa';

export default function MovieCard({ movie, onActivityUpdate }: { movie: any, onActivityUpdate?: () => void }) {
  const [isFavorite, setIsFavorite] = useState(movie.isFavorite);
  const [isWatchLater, setIsWatchLater] = useState(movie.isWatchLater);

  const toggleFavorite = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    const method = newStatus ? 'POST' : 'DELETE';
    await fetch(`/api/favorites/${movie.id}`, { method });
    
    if (onActivityUpdate) onActivityUpdate();
  };

  const toggleWatchLater = async () => {
    const newStatus = !isWatchLater;
    setIsWatchLater(newStatus);
    
    const method = newStatus ? 'POST' : 'DELETE';
    await fetch(`/api/watch-later/${movie.id}`, { method });
    
    if (onActivityUpdate) onActivityUpdate();
  };

  return (
    <div className="relative group w-full h-96 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
        <div className="text-white">
          <h3 className="font-bold text-xl">{movie.title}</h3>
          <p className="text-sm text-gray-300">{movie.releaseYear} • {movie.genres?.join(', ')}</p>
          <p className="mt-2 text-sm line-clamp-4">{movie.description}</p>
        </div>

        <div className="flex justify-end space-x-4 pb-2 pr-2">
          <button onClick={toggleWatchLater} className="text-3xl text-blue-400 hover:text-blue-300 transition">
            {isWatchLater ? <FaClock /> : <FaRegClock />}
          </button>
          <button onClick={toggleFavorite} className="text-3xl text-yellow-400 hover:text-yellow-300 transition">
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
      </div>
    </div>
  );
}
