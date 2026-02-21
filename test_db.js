import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri).then(async () => {
    const coachingCollection = mongoose.connection.collection('coachings');
    const doc = await coachingCollection.findOne({ email: 'trijalad@gmail.com' });
    console.log("Coaching by email:", JSON.stringify(doc, null, 2));

    const allCoachings = await coachingCollection.find({}).limit(5).toArray();
    console.log("Any coaching doc?", allCoachings.map(c => ({ email: c.email, owner_user_id: c.owner_user_id, name: c.name, slug: c.slug })));
    process.exit(0);
});
