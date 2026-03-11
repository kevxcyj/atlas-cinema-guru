import Link from 'next/link';

export default function Sidebar({ activityFeed }) {
  return (
    <div className="w-16 hover:w-64 transition-all duration-300 ease-in-out bg-gray-900 text-white h-full overflow-hidden flex flex-col group">
      <div className="p-4 whitespace-nowrap">
        <h2 className="opacity-0 group-hover:opacity-100 transition-opacity font-bold">Navigation</h2>
      </div>
      
      <nav className="flex-col flex flex-1 p-2 space-y-2">
        <Link href="/" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap">
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">Home</span>
        </Link>
        <Link href="/favorites" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap">
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">Favorites</span>
        </Link>
        <Link href="/watch-later" className="p-2 hover:bg-gray-800 rounded whitespace-nowrap">
           <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">Watch Later</span>
        </Link>
      </nav>

      {/* Activity Feed */}
      <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-700">
        <h3 className="font-bold text-sm mb-2">Activity Feed</h3>
        <ul className="text-xs space-y-1">
            <li>Added "Dune" to Favorites</li>
            <li>Added "Inception" to Watch Later</li>
            {}
        </ul>
      </div>
    </div>
  );
}