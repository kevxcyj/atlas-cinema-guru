import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { headers } from "next/headers";
import "./globals.css";

// Helper to fetch activities securely on the server
async function getActivityFeed(cookieHeader: string | null, host: string) {
  try {
    // Determine base URL dynamically for server-side fetching
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const res = await fetch(`${protocol}://${host}/api/activities`, {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.activities || [];
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch activity feed", error);
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin'); 
  }

  // Await the headers() function for Next.js 15 compatibility
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');
  const host = headersList.get('host') || 'localhost:3000';

  // Pass cookies and host to the fetch request
  const activityFeed = await getActivityFeed(cookieHeader, host);

  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100 m-0 p-0">
        <Sidebar activityFeed={activityFeed} /> 
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* App Logo */}
              <img src="/favicon.ico" alt="Atlas Cinema Guru Logo" className="w-8 h-8" />
              <h1 className="font-bold text-xl text-blue-600">Atlas Cinema Guru</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <a href="/api/auth/signout" className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Log Out
              </a>
            </div>
          </header>
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
