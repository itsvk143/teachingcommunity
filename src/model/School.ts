import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------------------------- */
    /*                         1) Core School Identity                            */
    /* -------------------------------------------------------------------------- */
    school_id: {
      type: String,
      unique: true,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: [true, 'Please provide school name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    description_short: {
      type: String,
      trim: true,
    },
    description_long: {
      type: String,
      trim: true,
    },
    founded_year: {
      type: Number,
    },
    principal_name: {
      type: String,
      trim: true,
    },

    /* -------------------------------------------------------------------------- */
    /*                         2) Academic Details                                */
    /* -------------------------------------------------------------------------- */
    board: {
      type: [String], // CBSE, ICSE, State Board, IB, IGCSE
      default: [],
    },
    medium: {
      type: [String], // English, Hindi, Regional
      default: [],
    },
    school_type: {
      type: String, // Co-ed, Boys, Girls
      enum: ['Co-ed', 'Boys', 'Girls'],
      default: 'Co-ed',
    },
    class_range: {
      type: String, // e.g., "Nursery to 12"
      trim: true,
    },
    streams_offered: {
      type: [String], // Science (PCM/PCB), Commerce, Arts/Humanities
      default: [],
    },

    /* -------------------------------------------------------------------------- */
    /*                         3) Location Fields                                 */
    /* -------------------------------------------------------------------------- */
    address_line1: { type: String, trim: true },
    address_line2: { type: String, trim: true },
    landmark: { type: String, trim: true },
    area_locality: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    google_maps_url: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         4) Contact Fields                                  */
    /* -------------------------------------------------------------------------- */
    phone_primary: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Primary phone number must be exactly 10 digits'],
    },
    phone_secondary: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Secondary phone number must be exactly 10 digits'],
    },
    email: {
      type: String,
      trim: true,
    },
    website_url: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         5) Images / Media                                  */
    /* -------------------------------------------------------------------------- */
    logo_url: { type: String, trim: true },
    cover_image_url: { type: String, trim: true },
    gallery_images: { type: [String], default: [] },
    brochure_pdf_url: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         6) Admission & Fees                                */
    /* -------------------------------------------------------------------------- */
    fee_range_min: { type: Number }, // Annual Fee Min
    fee_range_max: { type: Number }, // Annual Fee Max
    admission_process: { type: String, trim: true },
    form_link: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         7) Stats & Strength                                */
    /* -------------------------------------------------------------------------- */
    student_count: { type: Number },
    teacher_count: { type: Number },
    student_teacher_ratio: { type: String },

    /* -------------------------------------------------------------------------- */
    /*                         8) Facilities (Amenities)                          */
    /* -------------------------------------------------------------------------- */
    smart_classes: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    labs: { type: Boolean, default: false }, // Science/Computer Labs
    sports_ground: { type: Boolean, default: false },
    swimming_pool: { type: Boolean, default: false },
    auditorium: { type: Boolean, default: false },
    transport_available: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    hostel_support: { type: Boolean, default: false },
    cafeteria: { type: Boolean, default: false },
    ac_classrooms: { type: Boolean, default: false },

    /* -------------------------------------------------------------------------- */
    /*                         9) Admin / Owner Side                              */
    /* -------------------------------------------------------------------------- */
    owner_user_id: { type: String, trim: true }, // Linked User ID
    is_approved: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },

    unique_id: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

SchoolSchema.pre('save', async function (next) {
  if (!this.unique_id) {
    try {
      const Counter = mongoose.models.Counter || (await import('./Counter')).default;
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'school' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.unique_id = `S${counter.seq}`; // S for School
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

const School = mongoose.models.School || mongoose.model('School', SchoolSchema);

export default School;
