import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------------------------- */
    /*                         1) Basic School Identity                            */
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
    tagline: { type: String, trim: true },
    school_type: { // Playschool, Primary, Secondary, etc.
      type: String,
      trim: true,
    },
    board: {
      type: [String], // CBSE, ICSE, etc.
      default: [],
    },
    medium: {
      type: [String], // English, Hindi, etc.
      default: [],
    },
    school_code: { type: String, trim: true }, // Affiliation No.
    founded_year: { type: Number },
    registration_number: { type: String, trim: true },
    category: { // Govt, Private, Semi-govt
      type: String,
      trim: true,
    },
    gender_type: { // Boys, Girls, Co-ed
      type: String,
      enum: ['Co-ed', 'Boys', 'Girls'],
      default: 'Co-ed',
    },

    /* -------------------------------------------------------------------------- */
    /*                         2) Contact Details                                 */
    /* -------------------------------------------------------------------------- */
    phone_primary: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Primary phone number must be exactly 10 digits'],
    },
    phone_secondary: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true },
    website_url: { type: String, trim: true },
    social_links: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      youtube: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },

    /* -------------------------------------------------------------------------- */
    /*                         3) Address & Location                              */
    /* -------------------------------------------------------------------------- */
    address_line1: { type: String, trim: true }, // Full Address
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    landmark: { type: String, trim: true },
    area_type: { type: String, enum: ['Urban', 'Rural'], default: 'Urban' },
    google_maps_url: { type: String, trim: true }, // Link
    latitude: { type: String, trim: true },
    longitude: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         4) About School Section                            */
    /* -------------------------------------------------------------------------- */
    description_short: { type: String, trim: true }, // Brief intro
    description_long: { type: String, trim: true }, // About Description
    principal_message: { type: String, trim: true },
    vision: { type: String, trim: true },
    mission: { type: String, trim: true },
    core_values: { type: String, trim: true },
    why_choose_us: { type: [String], default: [] }, // Highlights

    /* -------------------------------------------------------------------------- */
    /*                         5) Management / Administration                     */
    /* -------------------------------------------------------------------------- */
    principal_name: { type: String, trim: true },
    principal_qualification: { type: String, trim: true },
    principal_photo_url: { type: String, trim: true },
    director_name: { type: String, trim: true },
    contact_person_name: { type: String, trim: true },
    contact_person_role: { type: String, trim: true },
    office_timing: { type: String, trim: true },
    total_teaching_staff: { type: Number },
    total_non_teaching_staff: { type: Number },

    /* -------------------------------------------------------------------------- */
    /*                         6) Academic Information                            */
    /* -------------------------------------------------------------------------- */
    class_range: { type: String, trim: true }, // e.g. Pre-Nursery to 12
    streams_offered: { type: [String], default: [] }, // Science, Commerce, Arts
    subjects_offered: { type: [String], default: [] },
    academic_session: { type: String, trim: true }, // e.g. April-March
    student_count: { type: Number },
    student_teacher_ratio: { type: String, trim: true },
    examination_pattern: { type: String, trim: true },
    special_programs: { type: [String], default: [] }, // Olympiad, NEET
    special_education_support: { type: String, trim: true }, // Counselling

    /* -------------------------------------------------------------------------- */
    /*                         7) Admission Details                               */
    /* -------------------------------------------------------------------------- */
    admission_open: { type: Boolean, default: false },
    admission_start_date: { type: Date },
    admission_end_date: { type: Date },
    eligibility_criteria: { type: String, trim: true },
    required_documents: { type: [String], default: [] },
    admission_process: { type: String, trim: true },
    online_form_link: { type: String, trim: true },

    // Fee Structure
    admission_fee: { type: Number },
    monthly_fee: { type: Number },
    annual_charges: { type: Number },
    transport_fee: { type: Number },
    scholarships: { type: String, trim: true },
    refund_policy_text: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         8) Infrastructure & Facilities                     */
    /* -------------------------------------------------------------------------- */
    campus_area: { type: String, trim: true }, // e.g. 2 Acres
    classroom_count: { type: Number },

    // Facilities (Booleans)
    smart_classes: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    science_labs: { type: Boolean, default: false },
    computer_lab: { type: Boolean, default: false },
    playground: { type: Boolean, default: false },
    indoor_games: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    drinking_water: { type: Boolean, default: false },
    washrooms: { type: Boolean, default: false },
    medical_room: { type: Boolean, default: false },
    accessibility_ramp: { type: Boolean, default: false }, // Lift/Ramp
    auditorium: { type: Boolean, default: false },
    hostel_facility: { type: Boolean, default: false },
    transport_facility: { type: Boolean, default: false }, // Bus avail
    bus_count: { type: Number },

    /* -------------------------------------------------------------------------- */
    /*                         9) Activities & Co-curricular                      */
    /* -------------------------------------------------------------------------- */
    sports_offered: { type: [String], default: [] },
    activities: {
      // Boolean flags for common activities
      yoga: { type: Boolean, default: false },
      dance: { type: Boolean, default: false },
      music: { type: Boolean, default: false },
      art_craft: { type: Boolean, default: false },
      martial_arts: { type: Boolean, default: false },
      drama: { type: Boolean, default: false },
      debate: { type: Boolean, default: false },
    },
    clubs: { type: [String], default: [] }, // Science club, Eco club
    annual_events: { type: [String], default: [] },

    /* -------------------------------------------------------------------------- */
    /*                         10) Safety & Security                              */
    /* -------------------------------------------------------------------------- */
    security_guard: { type: Boolean, default: false },
    fire_safety: { type: Boolean, default: false },
    first_aid: { type: Boolean, default: false },
    female_staff: { type: Boolean, default: false },
    student_pickup_policy: { type: String, trim: true },
    visitor_entry_policy: { type: String, trim: true },
    bus_attendant: { type: Boolean, default: false },

    /* -------------------------------------------------------------------------- */
    /*                         11) Achievements & Results                         */
    /* -------------------------------------------------------------------------- */
    academic_achievements: { type: String, trim: true },
    board_results: { type: String, trim: true }, // e.g. "100% Pass"
    sports_achievements: { type: String, trim: true },
    awards: { type: [String], default: [] },
    toppers_list: { type: [String], default: [] },
    alumni_achievements: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         12) Gallery / Media Content                        */
    /* -------------------------------------------------------------------------- */
    logo_url: { type: String, trim: true },
    cover_image_url: { type: String, trim: true },
    gallery_images: { type: [String], default: [] }, // Photo Gallery
    video_gallery: { type: [String], default: [] }, // Video Links
    brochure_pdf_url: { type: String, trim: true },
    prospectus_link: { type: String, trim: true },

    /* -------------------------------------------------------------------------- */
    /*                         13) Reviews & Testimonials                         */
    /* -------------------------------------------------------------------------- */
    google_rating: { type: String, trim: true },
    parent_reviews: { type: [String], default: [] }, // External links or text
    testimonials: [{
      name: String,
      role: String, // Student/Parent
      text: String,
      image_url: String
    }],
    media_mentions: { type: [String], default: [] },

    // Platform own reviews (New Dual System)
    platform_rating: { type: Number, default: 0 },
    platform_reviews_count: { type: Number, default: 0 },
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

    /* -------------------------------------------------------------------------- */
    /*                         14) FAQ                                            */
    /* -------------------------------------------------------------------------- */
    faqs: [{
      question: String,
      answer: String
    }],

    /* -------------------------------------------------------------------------- */
    /*                         15) Policies & Legal                               */
    /* -------------------------------------------------------------------------- */
    terms_conditions: { type: String, trim: true },
    privacy_policy: { type: String, trim: true },
    anti_bullying_policy: { type: String, trim: true },
    code_of_conduct: { type: String, trim: true },
    mandatory_disclosure: { type: String, trim: true }, // CBSE

    /* -------------------------------------------------------------------------- */
    /*                         Admin Fields                                       */
    /* -------------------------------------------------------------------------- */
    owner_user_id: { type: String, trim: true },
    is_approved: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    unique_id: {
      type: String,
      unique: true,
      index: true,
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
      this.unique_id = `S${counter.seq}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

const School = mongoose.models.School || mongoose.model('School', SchoolSchema);

export default School;
