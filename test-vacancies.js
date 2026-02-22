const mongoose = require('mongoose');
const Vacancy = require('./src/model/Vacancy').default;

require('dotenv').config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const vacs = await Vacancy.find({}).sort({createdAt: -1}).limit(5);
  console.log("Recent Vacancies:");
  vacs.forEach(v => {
    console.log(`- Job: ${v.jobTitle}, postedBy: ${v.postedBy}, _id: ${v._id}, isApproved: ${v.isApproved}`);
  });
  mongoose.disconnect();
}
run();
