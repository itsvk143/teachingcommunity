import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';
import TeachersPublicClient from './TeachersPublicClient';

export const metadata = {
    title: 'Teacher Directory | Teaching Community',
    description: 'Manage and view all registered educators.',
};

export default async function TeachersListRoot() {
    let initialTeachers = [];
    try {
        await dbConnect();
        // Fetch top 1000 teachers for instant client-side filtering.
        // In the future this should be upgraded to fully server-side filtering 
        // to support millions of records.
        const teachers = await Teacher.find({})
            .sort({ sequence: 1, createdAt: 1 })
            .limit(1000)
            .lean();

        // Serialize MongoDB objects safely
        initialTeachers = JSON.parse(JSON.stringify(teachers));
    } catch (error) {
        console.error("Failed to fetch teachers on server:", error);
    }

    return <TeachersPublicClient initialTeachers={initialTeachers} />;
}
