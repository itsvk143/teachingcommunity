'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, UserCog } from 'lucide-react';
import NonTeacherProfileView from '@/components/NonTeacherProfileView';

export default function NonTeacherPublicDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/non-teachers/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Profile not found");
        throw new Error("Failed to load profile");
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/nonteacherspublic"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* HEADER / BACK NAV */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/nonteacherspublic"
            className="flex items-center text-gray-500 hover:text-blue-600 transition font-medium text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mr-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Directory
          </Link>
          <div className="text-sm text-gray-400 font-mono">
            Public View
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {profile && <NonTeacherProfileView profile={profile} />}
      </div>
    </div>
  );
}
