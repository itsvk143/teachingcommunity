import mongoose from 'mongoose';

const ConsultantSchema = new mongoose.Schema(
    {
        /* -------------------------------------------------------------------------- */
        /*                         1) Core Consultant Identity                        */
        /* -------------------------------------------------------------------------- */
        consultant_id: {
            type: String,
            unique: true,
            required: true,
            default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: {
            type: String, // Individual Consultant or Contact Person name
            required: [true, 'Please provide name'],
            trim: true,
        },
        brand_name: {
            type: String, // e.g., "XYZ Consulting Services"
            required: [true, 'Please provide company/brand name'],
            trim: true,
        },
        slug: {
            type: String, // SEO URL: xyz-consulting-services
            unique: true,
            trim: true,
            required: true,
        },
        description: {
            type: String, // Short bio or firm description
            trim: true,
        },

        /* -------------------------------------------------------------------------- */
        /*                         2) Location Fields                                 */
        /* -------------------------------------------------------------------------- */
        address_line1: { type: String, trim: true },
        address_line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },

        /* -------------------------------------------------------------------------- */
        /*                         3) Contact Fields                                  */
        /* -------------------------------------------------------------------------- */
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10}$/, 'Primary phone number must be exactly 10 digits'],
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        website_url: { type: String, trim: true },

        /* -------------------------------------------------------------------------- */
        /*                         4) Images / Media                                  */
        /* -------------------------------------------------------------------------- */
        logo_url: { type: String, trim: true }, // Company Logo or Profile Photo

        /* -------------------------------------------------------------------------- */
        /*                         5) Admin / Owner Side                              */
        /* -------------------------------------------------------------------------- */
        owner_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked User Account ID (crucial for Auth)
        is_approved: { type: Boolean, default: true },

        unique_id: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true, // created_at, updated_at
    }
);

ConsultantSchema.pre('save', async function (next) {
    if (!this.unique_id) {
        try {
            const Counter = mongoose.models.Counter || (await import('./Counter')).default;
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'consultant' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.unique_id = `CONS${counter.seq}`;
        } catch (error) {
            return next(error as Error);
        }
    }
    next();
});

const Consultant = mongoose.models.Consultant || mongoose.model('Consultant', ConsultantSchema);

export default Consultant;
