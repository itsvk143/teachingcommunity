'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTeacher() {
  const params = useParams(); // ✅ Get params properly in client
  const id = params.id;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    subject: '',
    education: '',
    experience: '',
    city: '',
    state: '',
    nativeState: '',
    preferedState:'',
    age: '',
    photoUrl: '',
    about: '',
    maxQualification: '',
    graduationQualification: '',
    maxQualificationCollege: '',
    graduationCollege: '',
    currentInstitute: '',
    previousInstitutes: '',
    ctc: '',
    resumeLink: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
  });
  
  useEffect(() => {
    // Check if the API server is using /api or directly accessing a collection
    // Try both patterns to diagnose the issue
    async function fetchTeacher() {
      try {
        console.log(`Attempting to fetch teacher with ID: ${id}`);
        
        // First try /api/teachers/:id (most common Next.js pattern)
        let url = `/api/teachers/${id}`;
        console.log(`First attempt URL: ${url}`);
        
        let response = await fetch(url);
        console.log(`First response status: ${response.status} ${response.statusText}`);
        
        // If that fails, try alternate endpoints
        if (!response.ok) {
          // Try alternate URL format without /api prefix
          url = `/teachers/${id}`;
          console.log(`Alternate attempt URL: ${url}`);
          
          try {
            response = await fetch(url);
            console.log(`Alternate response status: ${response.status} ${response.statusText}`);
          } catch (err) {
            console.error('Error with alternate URL:', err);
          }
        }
        
        // Handle case where both attempts fail
        if (!response.ok) {
          let errorText;
          
          try {
            errorText = await response.text();
            console.error('Error response body:', errorText.substring(0, 200)); // Log partial response 
          } catch (e) {
            errorText = 'Unknown error';
          }
          
          // Check if HTML is returned instead of JSON
          if (errorText.includes('<!DOCTYPE html>') || errorText.includes('<html')) {
            throw new Error(`Server returned HTML instead of JSON. Check if the API endpoint is correct.`);
          } else {
            try {
              // Try to parse as JSON if possible
              const errorData = JSON.parse(errorText);
              throw new Error(`API Error: ${errorData.message || response.status}`);
            } catch (e) {
              // If not JSON, use the text directly (truncated)
              throw new Error(`API Error ${response.status}: ${errorText.substring(0, 50)}...`);
            }
          }
        }
        
        // Try to parse the response as JSON
        let data;
        try {
          data = await response.json();
          console.log('Teacher data received:', data);
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          throw new Error('Failed to parse server response as JSON. The API might be returning HTML instead.');
        }
        
        // Sanity check that we got actual teacher data
        if (!data || data.name === undefined) {
          throw new Error('Retrieved data does not contain expected teacher fields');
        }
        
        // Ensure socialLinks object exists
        if (!data.socialLinks) {
          data.socialLinks = {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: '',
          };
        }
        
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchTeacher:', err);
        setError(`${err.message} - Check console for details`);
        setLoading(false);
      }
    }
    
    if (id) {
      fetchTeacher();
    } else {
      setError('No teacher ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        // Safe handling of error responses
        const errorText = await response.text().catch(() => 'Unknown error');
        let errorMessage;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || `Error ${response.status}`;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${errorText.substring(0, 100)}`;
        }
        
        throw new Error(`Failed to update teacher: ${errorMessage}`);
      }
      
      router.push('/teachers');
    } catch (err) {
      console.error('Error updating teacher:', err);
      setError('Failed to update teacher. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  // A simpler debug section
  const renderDebugInfo = () => (
    <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50">
      <h2 className="text-lg font-bold mb-2">Debug Information</h2>
      <pre className="whitespace-pre-wrap overflow-auto max-h-96 bg-gray-100 p-2 rounded">
        {JSON.stringify({
          id: id,
          idType: typeof id,
          idLength: id?.length,
          formData: formData,
        }, null, 2)}
      </pre>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-4">Loading teacher data...</div>
        {renderDebugInfo()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        {renderDebugInfo()}
        <button 
          onClick={() => router.push('/teachers')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
        >
          Return to Teachers List
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                min="18"
                max="100"
              />
            </div>
           <div className="mb-4">
              <label className="block mb-2 font-medium">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Photo URL</label>
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Native State</label>
              <input
                type="text"
                name="nativeState"
                value={formData.nativeState}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div> 
             <div className="mb-4">
              <label className="block mb-2 font-medium">Currently Working In *</label>
              <input
                type="text"
                name="currentlyWorkingIn"
                value={formData.currentlyWorkingIn}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Current CTC</label>
              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="e.g., 5 LPA"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Prefered Loaction *</label>
              <input
                type="text"
                name="preferedstate"
                value={formData.preferedState}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Resume Link</label>
              <input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/resume.pdf"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Teaching Video Link</label>
              <input
                type="url"
                name="teachingVideoLink"
                value={formData.teachingVideoLink}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>
        </div>

        {/* Education Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Education Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Maximum Qualification</label>
              <input
                type="text"
                name="maxQualification"
                value={formData.maxQualification}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="e.g., M.Tech, PhD"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Graduation Qualification</label>
              <input
                type="text"
                name="graduationQualification"
                value={formData.graduationQualification}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="e.g., B.Tech, B.Sc"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Max Qualification College</label>
              <input
                type="text"
                name="maxQualificationCollege"
                value={formData.maxQualificationCollege}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Graduation College</label>
              <input
                type="text"
                name="graduationCollege"
                value={formData.graduationCollege}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Education Details</label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              rows="3"
              placeholder="Detailed education background..."
            />
          </div>
        </div>

        {/* Institute Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Institute Information</h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Current Institute</label>
            <input
              type="text"
              name="currentInstitute"
              value={formData.currentInstitute}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Previous Institutes</label>
            <textarea
              name="previousInstitutes"
              value={formData.previousInstitutes}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              rows="3"
              placeholder="List previous institutes separated by commas or new lines..."
            />
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">About</h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
              rows="4"
              placeholder="Tell us about yourself, your teaching philosophy, and interests..."
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Facebook</label>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://facebook.com/profile"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Twitter</label>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://twitter.com/profile"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">LinkedIn</label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://linkedin.com/in/profile"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Instagram</label>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                placeholder="https://instagram.com/profile"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/teachers')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      {process.env.NODE_ENV !== 'production' && renderDebugInfo()}
    </div>
  );
}