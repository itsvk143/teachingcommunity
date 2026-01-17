import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    classGrade: {
      type: String,
      required: [true, 'Please provide class/grade'],
      trim: true,
    },
    school: {
      type: String,
      required: [true, 'Please provide school name'],
      trim: true,
    },
    favoriteSubjects: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true, // "write about their profile"
    },
    friendsDetails: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of Birth is required'],
    },
    location: {
      type: String,
      trim: true,
    },
    languages: {
      type: String,
      trim: true,
    },
    schoolSentiment: {
      type: String,
      enum: ['Yes', 'No'],
    },
    schoolFeedback: {
      type: String, // Reason for liking or disliking
      trim: true,
    },
    hobbies: {
      type: String,
      trim: true,
    },
    parentsDetails: {
      type: String,
      trim: true,
    },
    goals: {
      type: String,
      trim: true,
    },
    visionFiveYears: {
      type: String,
      trim: true,
    },
    visionTenYears: {
      type: String,
      trim: true,
    },
    strength: {
      type: String,
      trim: true,
    },
    weakness: {
      type: String,
      trim: true,
    },
    otherDetails: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema);

export default StudentProfile;
