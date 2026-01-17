"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GraduationCap, Clock, MapPin, IndianRupee, Users } from "lucide-react";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.email) {
      fetchPosts();
    }
  }, [session, status]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/hometuition?email=${session.user.email}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter for role 'Student'
        const studentPosts = data.filter(p => p.role === 'Student');
        setPosts(studentPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    try {
      const res = await fetch(`/api/hometuition/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-500">Manage your learning requirements</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/students/register')}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold shadow hover:bg-teal-700 transition"
          >
            + Post New Requirement
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requirements posted</h3>
            <p className="text-gray-500 mb-6">You haven't posted any learning requirements yet.</p>
            <button
              onClick={() => router.push('/students/register')}
              className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
            >
              Post a Requirement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{post.subject}</h3>
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
                        {post.classGrade}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 mt-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{post.location}, {post.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span>{post.budget || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">Mode:</span>
                        <span>{post.mode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">Posted:</span>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 text-gray-400 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 md:border-l md:pl-6 md:min-w-[140px]">
                    <button
                      onClick={() => router.push(`/hometuition/${post._id}/edit`)} // Reusing existing edit page
                      className="w-full py-2 px-4 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition text-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="w-full py-2 px-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition text-center"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => router.push(`/hometuition/${post._id}`)}
                      className="w-full py-2 px-4 bg-teal-50 text-teal-600 font-medium rounded-lg hover:bg-teal-100 transition text-center"
                    >
                      View Public
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
