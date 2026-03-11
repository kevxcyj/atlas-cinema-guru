import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./globals.css";

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar activityFeed={[]} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header user={session.user} />
          
          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
