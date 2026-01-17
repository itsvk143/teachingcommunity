import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    slug: { type: String, required: true, unique: true },
    sequence: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

async function testCreate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const body = {
      name: "vikash kumar",
      email: "itsvikash143@gmail.com",
      phone: "8457876843"
    };

    // Simulate API logic
    const slug = `${body.email}-${body.phone}`;

    // Check existing
    const existing = await Teacher.findOne({ email: body.email });
    if (existing) {
      console.log('Teacher already exists:', existing._id);
      return;
    }

    // Get sequence
    const lastTeacher = await Teacher.findOne().sort({ sequence: -1 });
    const nextSequence = lastTeacher && lastTeacher.sequence ? lastTeacher.sequence + 1 : 1;
    console.log('Calculated Sequence:', nextSequence);

    const newTeacher = await Teacher.create({
      ...body,
      slug,
      sequence: nextSequence,
    });

    console.log('Teacher created successfully:', newTeacher._id);

  } catch (error) {
    console.error('Detailed Creation Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testCreate();
