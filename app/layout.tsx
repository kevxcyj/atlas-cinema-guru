import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin'); 
  }

  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100 m-0 p-0">
        <Sidebar activityFeed={[]} /> 
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="font-bold text-xl text-blue-600">Atlas Cinema Guru</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <a href="/api/auth/signout" className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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
