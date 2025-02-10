"use client"; // Mark this as a Client Component

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get the user session status
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Redirect user to login after logout
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading state while checking the session
  }

  if (!session) {
    router.push("/login"); // Redirect to login if user is not authenticated
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Dashboard
          </h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold">{session.user?.name}</span>
            !
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Email: <span className="font-medium">{session.user?.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="w-full mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
