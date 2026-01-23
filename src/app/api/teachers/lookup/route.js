import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Find teacher by _id or matching suffix
        // Since user might assume the displayed 6-char IS the ID, we must try to find a teacher whose _id ends with this.
        // MongoDB ObjectId cannot be easily regexed if stored as ObjectId.
        // However, we can try to find by valid ObjectId field if full length, or filter in memory if we assume limited dataset size for this demo_
        // Better approach for production: Store a real 'short_id' field.
        // For now: Fetch all or subset and filter, OR use $where (slow).
        // Let's assume for this specific user project context, we check if it is a valid full ID first.

        let teacher;

        // Check if it looks like a full ObjectId (24 hex chars)
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            teacher = await Teacher.findById(id).select('name photoUrl subject experience totalExperience').lean();
        } else {
            // Assume it's the short 6-char suffix displayed in directory on frontend
            // Currently we can't efficiently query suffix on ObjectId. 
            // We will fetch ALL teachers for this specific project scale (assuming <1000 active for now) and filter javascript side.
            // This is not scalable but solves the immediate user issue without schema migration.
            const allTeachers = await Teacher.find({}).select('name photoUrl subject experience totalExperience').lean();
            teacher = allTeachers.find(t => t._id.toString().slice(-6) === id);
        }

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                name: teacher.name,
                photo_url: teacher.photoUrl,
                subject: Array.isArray(teacher.subject) ? teacher.subject.join(', ') : teacher.subject,
                experience: teacher.totalExperience || teacher.experience,
                _id: teacher._id.toString()
            }
        });

    } catch (error) {
        console.error('Error in teacher lookup:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
