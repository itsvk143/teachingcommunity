"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (!result.error) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {/* Google Login Button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 488 512"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M488 261.8c0-17.8-1.6-35-4.6-51.6H249v97.9h134.3c-5.8 31.4-23.1 57.8-49.4 75.5v62.7h79.8c46.6-42.9 73.3-106 73.3-184.5z" fill="#4285F4" />
                <path d="M249 500c66.6 0 122.5-22 163.3-59.7l-79.8-62.7c-22.1 14.8-50.4 23.4-83.5 23.4-64 0-118.2-43.2-137.7-101.2H29.7v63.5C70.1 445.6 153.8 500 249 500z" fill="#34A853" />
                <path d="M111.3 299.8c-4.6-13.8-7.2-28.5-7.2-43.8s2.6-30 7.2-43.8v-63.5H29.7C10.7 180.4 0 213.7 0 256s10.7 75.6 29.7 106.2l81.6-62.4z" fill="#FBBC05" />
                <path d="M249 100.6c36.2 0 68.7 12.5 94.2 37l70.6-70.6C371.5 28.2 315.6 0 249 0 153.8 0 70.1 54.4 29.7 149.8l81.6 63.5C130.8 143.8 185 100.6 249 100.6z" fill="#EA4335" />
              </svg>
              Log in with Google
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
