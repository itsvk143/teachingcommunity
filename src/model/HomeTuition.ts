import mongoose from 'mongoose';

const HomeTuitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['Student', 'Parent'],
      default: 'Parent',
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide subject(s)'],
      trim: true,
    },
    classGrade: {
      type: String,
      required: [true, 'Please provide class/grade'],
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline',
    },
    studentGender: {
      type: String,
      enum: ['Male', 'Female', 'Both'],
    },
    tuitionType: {
      type: String,
      enum: ['One-to-One', 'Group'],
    },
    tutorGenderPreference: {
      type: String,
      enum: ['Male', 'Female', 'Flexible'],
      default: 'Flexible',
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index: Expire after 30 days (30 * 24 * 60 * 60 = 2592000 seconds)
// Note: If the collection already exists without this index, you might need to drop the index or collection manually for it to apply.
HomeTuitionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const HomeTuition = mongoose.models.HomeTuition || mongoose.model('HomeTuition', HomeTuitionSchema);

export default HomeTuition;
