import dbConnect from '@/lib/dbConnect';
import Coaching from '@/model/Coaching';
import CoachingClient from './CoachingClient';

export const metadata = {
    title: 'Coaching & HR Directory | Teaching Community',
    description: 'Find the best institutes, courses, and career opportunities.',
};

export default async function CoachingDirectoryRoot() {
    let initialCoachings = [];
    try {
        await dbConnect();
        // Fetch top 1000 coachings for instant client-side filtering.
        const coachings = await Coaching.find({})
            .sort({ createdAt: -1 })
            .limit(1000)
            .lean();

        // Serialize MongoDB objects safely
        initialCoachings = JSON.parse(JSON.stringify(coachings));
    } catch (error) {
        console.error("Failed to fetch coaching data on server:", error);
    }

    return <CoachingClient initialCoachings={initialCoachings} />;
}
