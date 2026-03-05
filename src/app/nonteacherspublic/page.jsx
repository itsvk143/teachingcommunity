import dbConnect from '@/lib/dbConnect';
import NonTeacher from '@/model/NonTeacher';
import NonTeachersClient from './NonTeachersClient';

export const metadata = {
    title: 'Non-Teaching Staff Directory | Teaching Community',
    description: 'Connect with qualified administrative, technical, and support professionals.',
};

export default async function NonTeachersListRoot() {
    let initialStaff = [];
    try {
        await dbConnect();
        // Fetch top 1000 staff members for instant client-side filtering.
        const staff = await NonTeacher.find({})
            .sort({ createdAt: -1 })
            .limit(1000)
            .lean();

        // Serialize MongoDB objects safely
        initialStaff = JSON.parse(JSON.stringify(staff));
    } catch (error) {
        console.error("Failed to fetch non-teaching staff on server:", error);
    }

    return <NonTeachersClient initialStaff={initialStaff} />;
}
