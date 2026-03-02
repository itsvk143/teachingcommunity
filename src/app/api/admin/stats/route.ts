import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';
import Vacancy from '@/model/Vacancy';
import Coaching from '@/model/Coaching';
import HomeTuition from '@/model/HomeTuition';
import NonTeacher from '@/model/NonTeacher';
import Consultant from '@/model/Consultant';

export async function GET() {
  try {
    await dbConnect();

    // Run count queries in parallel for performance
    const [teachersCount, vacanciesCount, coachingCount, homeTuitionCount, nonTeachersCount, consultantsCount] = await Promise.all([
      Teacher.countDocuments({}),
      Vacancy.countDocuments({}),
      Coaching.countDocuments({}),
      HomeTuition.countDocuments({}),
      NonTeacher.countDocuments({}),
      Consultant.countDocuments({})
    ]);

    return NextResponse.json({
      teachers: teachersCount,
      vacancies: vacanciesCount,
      coachings: coachingCount,
      hometuition: homeTuitionCount,
      nonTeachers: nonTeachersCount,
      consultants: consultantsCount
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
