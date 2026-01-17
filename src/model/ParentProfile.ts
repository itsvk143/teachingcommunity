import mongoose from 'mongoose';

const ParentProfileSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    numberOfChildren: {
      type: Number,
      required: [true, 'Please provide number of children'],
      min: 1,
    },
    children: [
      {
        age: { type: Number, required: true },
        classGrade: { type: String, required: true },
        school: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      }
    ],
    employmentType: {
      type: String,
      enum: ['Salaried', 'Self Employed', 'Entrepreneur', 'Homemaker', 'Unemployed', 'Student', 'Other'],
    },
    currentCity: { type: String, trim: true },
    currentState: { type: String, trim: true },
    nativeCity: { type: String, trim: true },
    nativeState: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const ParentProfile = mongoose.models.ParentProfile || mongoose.model('ParentProfile', ParentProfileSchema);

export default ParentProfile;
