'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Briefcase, MapPin, Building2, Clock, IndianRupee, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VacancyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: session } = useSession();

  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchVacancy() {
      try {
        const res = await fetch(`/api/vacancies/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Vacancy not found');
          throw new Error('Failed to fetch vacancy details');
        }
        const data = await res.json();
        setVacancy(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchVacancy();
    }
  }, [id]);

  const handleApply = async () => {
    if (!session) {
      toast.error('Please login to apply');
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vacancyId: id }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setHasApplied(true);
        toast.success('Applied successfully!');
      } else if (res.status === 409) {
        setHasApplied(true);
        toast('You have already applied for this job.', { icon: 'ℹ️' });
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Vacancy not found'}</p>
          <Link href="/vacancies">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Back to Vacancies
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{vacancy.jobTitle}</h1>
            <div className="flex flex-wrap gap-4 text-blue-50">
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                <span className="font-medium">{vacancy.companyName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{vacancy.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{vacancy.jobType}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center text-blue-800 mb-2 font-semibold">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </div>
                <p className="text-gray-700">{vacancy.experience || 'Not specified'}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center text-green-800 mb-2 font-semibold">
                  <IndianRupee className="w-5 h-5 mr-2" />
                  Salary
                </div>
                <p className="text-gray-700">{vacancy.salary || 'Competitive / Negotiable'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {vacancy.description}
              </div>
            </div>

            {/* Contact / Apply */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Info & Apply</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Resume to</p>
                    <a href={`mailto:${vacancy.contactEmail}`} className="text-blue-600 font-medium hover:underline">
                      {vacancy.contactEmail}
                    </a>
                  </div>
                </div>

                {vacancy.contactPhone && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Call / WhatsApp</p>
                      <a href={`tel:${vacancy.contactPhone}`} className="text-gray-800 font-medium hover:text-blue-600">
                        {vacancy.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>


              <div className="mt-8 space-y-4">
                {hasApplied ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 font-bold py-3.5 rounded-lg border border-green-200 cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Application Submitted
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-lg"
                  >
                    {applying ? 'Submitting...' : 'Easy Apply Now'}
                  </button>
                )}

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {vacancy.googleFormLink && (
                  <>
                    <a
                      href={vacancy.googleFormLink}
                      target="_blank"
                      className="block w-full text-center bg-purple-600 text-white font-bold py-3.5 rounded-lg hover:bg-purple-700 transform transition active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      Apply via Google Form
                    </a>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                  </>
                )}

                <a
                  href={`mailto:${vacancy.contactEmail}?subject=Application for ${vacancy.jobTitle}`}
                  className="block w-full text-center bg-white text-gray-700 font-medium py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  Apply via Email
                </a>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
              Posted on {new Date(vacancy.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
