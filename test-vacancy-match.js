const mongoose = require('mongoose');

async function testMatch() {
  const body = {
    city: 'Patna',
    state: 'Bihar',
    vacancyCategory: 'Teaching',
    subject: 'Mathematics',
    exam: ['JEE Main', 'NEET']
  };

  const locQuery = { $or: [] };
  const cleanCity = body.city;
  const cleanState = body.state;

  locQuery.$or.push({ city: { $regex: new RegExp(`^${cleanCity}$`, 'i') } });
  locQuery.$or.push({ state: { $regex: new RegExp(`^${cleanState}$`, 'i') } });
  locQuery.$or.push({ nativeState: { $regex: new RegExp(`^${cleanState}$`, 'i') } });
  locQuery.$or.push({ preferedState: { $elemMatch: { $regex: new RegExp(`^${cleanState}$`, 'i') } } });
  locQuery.$or.push({ preferedState: { $elemMatch: { $regex: /Pan India/i } } });

  const tQuery = { email: { $exists: true, $ne: null } };
  tQuery.$or = locQuery.$or;

  const subjectRegexes = [new RegExp(`^${body.subject}$`, 'i')];
  tQuery.subject = { $in: subjectRegexes };

  const examRegexes = body.exam.map(e => new RegExp(`^${e}$`, 'i'));
  tQuery.exams = { $in: examRegexes };

  console.log("Teacher Query Payload:");
  console.log(JSON.stringify({ ...tQuery, exams: { $in: body.exam }, subject: { $in: [body.subject] }, $or: "Location Logic" }, null, 2));

  console.log("\n-------------------\n");

  const ntQuery = { email: { $exists: true, $ne: null } };
  ntQuery.$or = locQuery.$or;
  console.log("NonTeacher Query Payload:");
  console.log(JSON.stringify({ ...ntQuery, $or: "Location Logic" }, null, 2));
}

testMatch();
