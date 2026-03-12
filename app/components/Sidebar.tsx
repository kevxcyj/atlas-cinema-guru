import Link from 'next/link';

export default function Sidebar({ activityFeed = [] }: { activityFeed?: any[] }) {
  return (
    <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-gray-900 text-white h-full overflow-hidden flex flex-col group z-50">
      <div className="p-4 whitespace-nowrap">
        <h2 className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">Navigation</h2>
      </div>
      
      <nav className="flex-col flex flex-1 p-2 space-y-2">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap flex items-center">
           <span className="text-xl">🏠</span>
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">Home</span>
        </Link>
        <Link href="/favorites" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap flex items-center">
           <span className="text-xl">⭐</span>
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">Favorites</span>
        </Link>
        <Link href="/watch-later" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap flex items-center">
           <span className="text-xl">🕒</span>
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">Watch Later</span>
        </Link>
      </nav>

      <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-700">
        <h3 className="font-bold text-sm mb-2">Activity Feed</h3>
        <ul className="text-xs space-y-2">
          {activityFeed.length === 0 ? (
            <li className="text-gray-400">No recent activity.</li>
          ) : (
            activityFeed.map((activity, idx) => (
              <li key={idx} className="border-b border-gray-700 pb-1">
                <span className="text-gray-400 block mb-1">{new Date(activity.createdAt).toLocaleDateString()}</span>
                <p>
                  {activity.action === 'favorited' ? '⭐ Favorited ' : '🕒 Watch Later '} 
                  <strong>{activity.movieTitle}</strong>
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
