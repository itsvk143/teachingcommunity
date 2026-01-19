import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema(
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

    subject: {
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
    city: { type: String, trim: true, index: true },
    exams: {
      type: [String],
      trim: true,
      index: true,
    },
    age: { type: String, trim: true },
    dob: { type: Date },
    photoUrl: { type: String, trim: true },
    about: { type: String, trim: true },

    maxQualification: { type: String, trim: true },
    graduationQualification: { type: String, trim: true },
    maxQualificationCollege: { type: String, trim: true },
    graduationCollege: { type: String, trim: true },

    educationalQualification: [
      {
        qualification: { type: String, trim: true }, // e.g. 10th, 12th
        boardUniv: { type: String, trim: true },
        year: { type: String, trim: true },
        percentage: { type: String, trim: true },
        medium: { type: String, trim: true }, // English/Hindi
        schoolName: { type: String, trim: true }, // Optional School Name
      },
    ],

    currentInstitute: { type: String, trim: true },
    currentEmployeeCode: { type: String, trim: true }, // Optional
    previousInstitutes: { type: String, trim: true },
    previousEmployeeCodes: { type: String, trim: true }, // Optional
    ctc: { type: String, trim: true },

    resumeLink: { type: String, trim: true },
    teachingVideoLink: { type: String, trim: true },

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

    /* ======================
       ⭐ SEQUENCE FIELD
       ====================== */
    /* ======================
       ⭐ SEQUENCE FIELD
       ====================== */
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

TeacherSchema.pre('save', async function (next) {
  if (!this.unique_id) {
    try {
      const Counter = mongoose.models.Counter || (await import('./Counter')).default;
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'teacher' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.unique_id = `T${counter.seq}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Prevent model overwrite in dev
const Teacher =
  mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

export default Teacher;
