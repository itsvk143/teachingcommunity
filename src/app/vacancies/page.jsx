import dbConnect from '@/lib/dbConnect';
import Vacancy from '@/model/Vacancy';
import User from '@/model/User';
import VacanciesClient from './VacanciesClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Server rendering for better SEO & performance
export const metadata = {
    title: 'Job Vacancies | Teaching Community',
    description: 'Browse the latest teaching and non-teaching job vacancies across India.',
};

export default async function VacanciesPageRoot() {
    const session = await getServerSession(authOptions);

    const isRegisteredUser =
        session?.user &&
        ['teacher', 'non-teacher', 'school', 'coaching', 'consultant', 'admin', 'hr'].includes(session.user?.role);

    if (!session || !isRegisteredUser) {
        // Avoid fetching DB and rendering the full client page if unauthorized
        return <VacanciesClient initialVacancies={[]} unauthorized={true} />;
    }

    let initialVacancies = [];
    try {
        await dbConnect();
        // Fetch only approved vacancies for public viewing
        const vacancies = await Vacancy.find({ isApproved: true })
            .populate({ path: 'postedBy', model: User, select: 'name' })
            .sort({ createdAt: -1 })
            .lean();

        // Serialize MongoDB objects (ObjectId, Date) to pass safely to Client Components
        initialVacancies = JSON.parse(JSON.stringify(vacancies));
    } catch (error) {
        console.error("Failed to fetch vacancies on server:", error);
    }

    return <VacanciesClient initialVacancies={initialVacancies} />;
}
