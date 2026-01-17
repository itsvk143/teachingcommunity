'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Phone, User, BookOpen, Clock, ArrowLeft } from 'lucide-react';

export default function HomeTuitionDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/hometuition/${params.id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Post not found</h2>
      <button onClick={() => router.back()} className="text-blue-600 hover:underline">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to List
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.subject} Tuition</h1>
            <div className="flex flex-wrap gap-4 mt-4">
              {post.classGrade && (
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">
                  {post.classGrade}
                </span>
              )}
              {post.mode && (
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">
                  {post.mode}
                </span>
              )}
              {post.tuitionType && (
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/30">
                  {post.tuitionType}
                </span>
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Requirement Details
                </h3>
                <div className="space-y-4 text-gray-700">
                  {post.studentGender && <p><span className="font-medium text-gray-900">Student Gender:</span> {post.studentGender}</p>}
                  {post.tutorGenderPreference && <p><span className="font-medium text-gray-900">Tutor Preference:</span> {post.tutorGenderPreference}</p>}
                  <p><span className="font-medium text-gray-900">Budget:</span> {post.budget || 'Not Disclosed'}</p>
                  <p><span className="font-medium text-gray-900">Description:</span> <br /> {post.description || 'No additional details provided.'}</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Location
                </h3>
                <p className="text-gray-700">
                  {post.location}
                  {post.city ? `, ${post.city}` : ''}
                  {post.state ? `, ${post.state}` : ''}
                </p>
              </section>
            </div>

            {/* Sidebar / Contact */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Posted By
                </h3>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 font-medium">{post.name}</p>
                  <p className="text-gray-500 text-xs">
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <a
                  href={`tel:${post.contact}`}
                  className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
                <p className="text-center text-gray-500 text-xs mt-3">
                  Click to call directly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
