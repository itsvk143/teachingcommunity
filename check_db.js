import mongoose from 'mongoose';
import Coaching from './src/model/Coaching.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coachings = await Coaching.find({ $or: [{email: "trijalad@gmail.com"}, {owner_user_id: "67b866c1f2be86cffa6720db"}] }); // Guessing ID doesn't matter, just find by email or owner_user_id manually and see what's wrong.
  console.log(coachings);
  process.exit(0);
}
run();
