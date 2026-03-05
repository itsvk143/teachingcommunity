import dbConnect from '@/lib/dbConnect';
import School from '@/model/School';
import SchoolsClient from './SchoolsClient';

export const metadata = {
    title: 'Partner Schools | Teaching Community',
    description: 'Find the best schools in your area',
};

export default async function SchoolsListRoot() {
    let initialSchools = [];
    try {
        await dbConnect();
        // Fetch top 1000 schools for instant client-side filtering.
        const schools = await School.find({})
            .sort({ createdAt: -1 })
            .limit(1000)
            .lean();

        // Serialize MongoDB objects safely
        initialSchools = JSON.parse(JSON.stringify(schools));
    } catch (error) {
        console.error("Failed to fetch schools on server:", error);
    }

    return <SchoolsClient initialSchools={initialSchools} />;
}
