export const dynamic = 'force-dynamic';

import DiscussionClient from "./DiscussionClient";
import dbConnect from "@/lib/dbConnect";
import Discussion from "@/model/Discussion";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const getAvailableCategories = (role) => {
    if (role === 'admin') return ["All", "General", "Teacher", "Non-Teacher", "Coaching", "School", "Home Tuition", "Consultant", "Parents", "Student", "BOARD", "NEET", "JEE", "SSC", "PSC", "BANKING", "NEET/JEE", "FOUNDATION", "OTHER"];
    const base = ["All", "General"];
    switch (role) {
        case 'teacher': return [...base, "Teacher", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"];
        case 'non-teacher': return [...base, "Non-Teacher"];
        case 'school': return [...base, "School"];
        case 'coaching': return [...base, "Coaching", "NEET/JEE", "BOARD", "FOUNDATION", "PSC", "BANKING"];
        case 'parent': return [...base, "Parents"];
        case 'student': return [...base, "Student", "BOARD", "NEET", "JEE", "SSC", "PSC", "BANKING", "OTHER"];
        case 'consultant': return [...base, "Consultant"];
        default: return base;
    }
};

export default async function DiscussionPage() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    const isUnregistered = !session || userRole === "user";

    // Stop execution early and just render the "Access Restricted" blank state via client
    if (isUnregistered) {
        return <DiscussionClient initialDiscussions={[]} allowedCategories={[]} isUnregistered={true} />;
    }

    const allowedCategories = getAvailableCategories(userRole);

    await dbConnect();

    // Replicate baseline API fetching logic for initial load (category "All" implies their allowed categories)
    const query = {};
    if (userRole !== 'admin') {
        const fetchCategories = allowedCategories.filter(c => c !== "All");
        query.category = { $in: fetchCategories };
    }

    const discussions = await Discussion.find(query).sort({ createdAt: -1 }).lean();

    const mappedDiscussions = discussions.map(d => {
        const replyCount = Array.isArray(d.replies) ? d.replies.length : 0;
        const { replies, ...rest } = d;
        return {
            ...rest,
            replyCount
        };
    });

    // Safely stringify Mongoose ObjectIds and Dates for the Client Component
    const initialDiscussions = JSON.parse(JSON.stringify(mappedDiscussions));

    return <DiscussionClient initialDiscussions={initialDiscussions} allowedCategories={allowedCategories} isUnregistered={false} />;
}
