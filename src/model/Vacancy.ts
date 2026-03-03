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
      enum: ['Full Time', 'Part Time', 'Contract', 'Per Class'],
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

    selectionProcess: {
      writtenTest: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      teacherDemo: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      studentDemo: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      interview: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
    },

    experience: {
      type: String,
      trim: true,
    },

    stream: [{
      type: String,
      trim: true,
    }],

    exam: [{
      type: String,
      trim: true,
    }],

    salaryMin: {
      type: String,
      trim: true,
    },

    salaryMax: {
      type: String,
      trim: true,
    },

    salary: {
      type: String,
      trim: true,
      // Keeping this column for backward compatibility with old records,
      // but new/updated code should rely on salaryMin & salaryMax.
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

    googleFormLink: {
      type: String,
      trim: true,
    },

    // ⭐ Future-ready (admin approval)
    isApproved: {
      type: Boolean,
      default: false,
    },

    country: {
      type: String,
      default: 'India',
      trim: true,
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

// ⚠️ Accessing the existing model to checks for paths might be needed for hot-reload support
if (mongoose.models.Vacancy && !mongoose.models.Vacancy.schema.paths['selectionProcess']) {
  mongoose.models.Vacancy.schema.add({
    selectionProcess: {
      writtenTest: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      teacherDemo: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      studentDemo: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
      interview: { type: String, enum: ['Online', 'Offline', 'Not Required', ''], default: '' },
    }
  });
}

export default mongoose.models.Vacancy ||
  mongoose.model('Vacancy', VacancySchema);