import mongoose from 'mongoose';

const VacancySchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
      required: true,
    },

    numberOfOpenings: {
      type: Number,
      default: 1,
    },

    requirements: [{
      subject: { type: String, required: true },
      count: { type: Number, default: 1 }
    }],

    experience: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    // ⭐ Future-ready (admin approval)
    isApproved: {
      type: Boolean,
      default: false,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
    },

    postedBy: {
      type: String, // User ID or Name
    },

    posterRole: {
      type: String, // 'admin', 'coaching', 'teacher', 'non-teacher'
    },

    vacancyCategory: {
      type: String,
      enum: ['Teaching', 'Non-Teaching'],
      default: 'Teaching',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vacancy ||
  mongoose.model('Vacancy', VacancySchema);