import mongoose from 'mongoose';

const NonTeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'],
    },
    whatsapp: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'WhatsApp number must be exactly 10 digits'],
    },

    gender: { type: String, trim: true },

    jobRole: {
      type: [String],
      trim: true,
    },

    education: { type: String, trim: true },

    experience: { type: String, trim: true },

    state: { type: String, trim: true },
    nativeState: { type: String, trim: true },

    preferedState: {
      type: [String],
      trim: true,
    },

    currentlyWorkingIn: { type: String, trim: true },
    age: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    about: { type: String, trim: true },

    maxQualification: { type: String, trim: true },
    graduationQualification: { type: String, trim: true },
    maxQualificationCollege: { type: String, trim: true },
    graduationCollege: { type: String, trim: true },

    currentInstitute: { type: String, trim: true },
    currentEmployeeCode: { type: String, trim: true },
    previousInstitutes: { type: String, trim: true },
    previousEmployeeCodes: { type: String, trim: true },
    ctc: { type: String, trim: true },

    resumeLink: { type: String, trim: true },

    // Non-teachers might not have teaching videos, but maybe intro videos? Keeping generic.
    introVideoLink: { type: String, trim: true },

    socialLinks: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Personal Details
    dob: { type: Date },
    dobVisibility: {
      type: String,
      enum: ['everyone', 'hr_only', 'mask_year'],
      default: 'everyone',
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    maritalStatus: { type: String, trim: true },
    nationality: { type: String, trim: true },
    religion: { type: String, trim: true },
    languages: {
      type: [String],
      trim: true,
    },

    // Job Profile
    careerObjective: { type: String, trim: true },

    // Educational Qualification
    educationalQualification: [
      {
        qualification: { type: String, trim: true }, // e.g. 10th, 12th, B.Com
        boardUniv: { type: String, trim: true },
        year: { type: String, trim: true }, // Year of passing
        percentage: { type: String, trim: true },
      },
    ],

    // Technical Skills
    technicalSkills: {
      type: [String],
      trim: true,
    },

    // Work Experience
    workExperience: [
      {
        organization: { type: String, trim: true },
        designation: { type: String, trim: true },
        duration: { type: String, trim: true }, // From-To
        responsibilities: { type: String, trim: true },
        employeeCode: { type: String, trim: true }, // Optional
      },
    ],

    // Key Skills / Strengths
    keySkills: {
      type: [String],
      trim: true,
    },

    // Certifications
    certifications: {
      type: [String],
      trim: true,
    },

    sequence: {
      type: Number,
      default: 0,
      index: true,
    },



    unique_id: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

NonTeacherSchema.pre('save', async function (next) {
  if (!this.unique_id) {
    try {
      const Counter = mongoose.models.Counter || (await import('./Counter')).default;
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'non-teacher' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.unique_id = `A${counter.seq}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Prevent model overwrite in dev
const NonTeacher =
  mongoose.models.NonTeacher || mongoose.model('NonTeacher', NonTeacherSchema);

export default NonTeacher;
