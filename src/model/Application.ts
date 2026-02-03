import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
    {
        vacancyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vacancy',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        // Optional: store simple snapshot if user profile changes?
        // User request says "fetch ... existing profile details", implies dynamic, but snapshot is safer.
        // However, request says "By using the 'logged-in user's ID,' you ensure the dashboard pulls the most up-to-date info"
        // So we should NOT snapshot.
    },
    { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ vacancyId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Application ||
    mongoose.model('Application', ApplicationSchema);
