import React from 'react';
import Link from 'next/link';
import SchoolProfileView from '@/components/SchoolProfileView';
import dbConnect from '@/lib/dbConnect';
import School from '@/model/School';

async function getSchool(id) {
    await dbConnect();
    try {
        // 1. Try direct ID lookup if it looks like a valid specific ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            const school = await School.findById(id);
            if (school) return JSON.parse(JSON.stringify(school));
        }

        // 2. Fallback: Try finding by Last-6 characters of _id (displayed in UI)
        const allSchools = await School.find({}).lean();
        const school = allSchools.find(s => s._id.toString().slice(-6) === id);

        if (school) {
            return JSON.parse(JSON.stringify(school));
        }

        return null;
    } catch (error) {
        console.error("Error fetching school:", error);
        return null;
    }
}

export default async function SchoolProfilePage(props) {
    const params = await props.params;
    const school = await getSchool(params.id);

    if (!school) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-6xl font-bold text-gray-200">404</h1>
                <p className="text-gray-500 mt-2">School profile not found</p>
                <Link href="/" className="mt-6 text-blue-600 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="w-full max-w-7xl mx-auto px-4">
                <SchoolProfileView school={school} />
            </div>
        </div>
    );
}
