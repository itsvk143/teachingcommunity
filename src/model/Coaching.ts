import mongoose from 'mongoose';

const CoachingSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------------------------- */
    /*                         1) Core Institute Identity                         */
    /* -------------------------------------------------------------------------- */
    coaching_id: {
      type: String,
      unique: true,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: [true, 'Please provide institute name'],
      trim: true,
    },
    brand_name: {
      type: String, // e.g., Aakash / Allen / PW
      trim: true,
    },
    center_name: {
      type: String, // e.g., "Aakash Institute – Patna Centre"
      trim: true,
    },
    slug: {
      type: String, // SEO URL: aakash-institute-patna
      unique: true,
      trim: true,
      required: true,
    },
    description_short: {
      type: String, // 1–2 lines
      trim: true,
    },
    description_long: {
      type: String, // detailed about institute
      trim: true,
    },

    /* -------------------------------------------------------------------------- */
    /*                         2) Categories / Courses                            */
    /* -------------------------------------------------------------------------- */
    exam_types: {
      type: [String], // NEET, JEE, Foundation, CUET, Board
      default: [],
    },
    streams: {
      type: [String], // PCM, PCB, PCMB, Commerce, Arts
      default: [],
    },
    classes_supported: {
      type: [String], // Class 6–12, Dropper
      default: [],
    },
    courses_offered: {
      type: [String], // NEET 1 Year, NEET 2 Year, JEE 2 Year...
      default: [],
    },
    course_categories: {
      type: Object, // Legacy support
      default: {},
    },
    categories: [
      {
        key: String, // e.g. "FOUNDATION"
        exams: [
          {
            name: String, // e.g. "Class 1-5"
            custom_name: String, // For "Other"
            courses: [
              {
                name: String,
                custom_name: String
              }
            ],
          }
        ],
        subjects: [String]
      }
    ],
    mode: {
      type: [String], // Offline / Online / Hybrid
      default: [],
    },
    medium: {
      type: [String], // English / Hindi / Hinglish / Regional
      default: [],
    },
    batch_timing: {
      type: [String], // Weekdays Batches, Weekend Batches
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
    latitude: { type: Number },
    longitude: { type: Number },
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
    whatsapp_number: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'WhatsApp number must be exactly 10 digits'],
    },
    email: {
      type: String,
      trim: true,
    },
    website_url: { type: String, trim: true },
    contact_person_name: { type: String, trim: true },
    enquiry_link: { type: String, trim: true },
    contact_visibility: {
      type: String,
      enum: ['everyone', 'hr_only'],
      default: 'everyone',
    },

    /* -------------------------------------------------------------------------- */
    /*                         5) Google Business Existing                        */
    /* -------------------------------------------------------------------------- */
    google_place_id: { type: String, trim: true },
    google_rating: { type: Number },
    google_review_count: { type: Number },
    google_category: { type: String, trim: true },
    google_business_status: { type: String, trim: true }, // Operational / Temporarily Closed
    open_now: { type: Boolean, default: false },
    working_hours: { type: mongoose.Schema.Types.Mixed }, // JSON structure day-wise
    popular_times: { type: mongoose.Schema.Types.Mixed }, // optional
    google_listing_url: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         6) Images / Media                                  */
    /* -------------------------------------------------------------------------- */
    logo_url: { type: String, trim: true },
    cover_image_url: { type: String, trim: true },
    gallery_images: { type: [String], default: [] },
    videos: { type: [String], default: [] }, // video urls
    brochure_pdf_url: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         7) Fees / PricingFields                            */
    /* -------------------------------------------------------------------------- */
    fee_range_min: { type: Number },
    fee_range_max: { type: Number },
    course_fees: [
      {
        course_name: String,
        fee: String,
      }
    ],
    currency: { type: String, default: 'INR' },
    pricing_note: { type: String, trim: true },
    installment_available: { type: Boolean, default: false },
    free_demo_available: { type: Boolean, default: false },

    /* -------------------------------------------------------------------------- */
    /*                         8) Faculty & Teaching Strength                     */
    /* -------------------------------------------------------------------------- */
    faculty_count: { type: Number },
    top_faculties: [
      {
        name: String,
        subject: String,
        experience: String,
        photo_url: String,
        teacher_id: String, // Manual or System ID
        profile_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } // Link to actual profile
      },
    ],
    teaching_methodology: { type: [String], default: [] },
    doubt_support: { type: String, trim: true }, // Yes/No + details
    batch_strength_avg: { type: Number },
    student_teacher_ratio: { type: String },

    student_count: { type: Number },
    non_academic_staff_count: { type: Number },
    subject_wise_faculty: [
      {
        subject: String,
        count: Number,
      }
    ],

    /* -------------------------------------------------------------------------- */
    /*                         9) Facilities (Amenities)                          */
    /* -------------------------------------------------------------------------- */
    ac_classrooms: { type: Boolean, default: false },
    smart_classes: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    study_room: { type: Boolean, default: false },
    hostel_support: { type: Boolean, default: false },
    transport_available: { type: Boolean, default: false },
    separate_doubt_counter: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    biometric_attendance: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },

    /* -------------------------------------------------------------------------- */
    /*                         10) Performance / Results                          */
    /* -------------------------------------------------------------------------- */
    top_results: [
      {
        year: Number,
        name: String,
        rank_or_score: String,
        exam: String,
        student_enrollment_id: String,
      },
    ],
    selection_count_neet: { type: Number },
    selection_count_jee: { type: Number },
    result_highlights_text: { type: String },
    success_stories: [
      {
        name: String,
        content: String,
        photo_url: String,
      },
    ],

    /* -------------------------------------------------------------------------- */
    /*                         11) Reviews System                                 */
    /* -------------------------------------------------------------------------- */
    // Imported from Google
    google_reviews_list: [
      {
        author_name: String,
        rating: Number,
        text: String,
        relative_time_description: String,
        time: Number,
      },
    ],
    // Platform own reviews
    platform_rating: { type: Number, default: 0 },
    platform_reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String,
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        review_category: {
          type: String,
          enum: ['general', 'staff'],
          default: 'general'
        },
        createdAt: { type: Date, default: Date.now },
        reply: {
          text: String,
          createdAt: { type: Date, default: Date.now },
        },
      },
    ],
    review_tags: { type: [String], default: [] }, // "Recommended", "Good Faculty"

    /* -------------------------------------------------------------------------- */
    /*                         13) Admin / Owner Side                             */
    /* -------------------------------------------------------------------------- */
    owner_user_id: { type: String, trim: true }, // Linked User ID
    claim_status: {
      type: String,
      enum: ['claimed', 'unclaimed'],
      default: 'unclaimed',
    },
    is_approved: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },

    unique_id: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true, // created_at, updated_at
  }
);

CoachingSchema.pre('save', async function (next) {
  if (!this.unique_id) {
    try {
      const Counter = mongoose.models.Counter || (await import('./Counter')).default;
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'coaching' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.unique_id = `C${counter.seq}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

const Coaching = mongoose.models.Coaching || mongoose.model('Coaching', CoachingSchema);

export default Coaching;
