import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'hr', 'coaching'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function makeAdmin() {
  const email = process.argv[2];
  const role = process.argv[3] || 'admin';

  if (!email) {
    console.log('Usage: node scripts/make-admin.mjs <email> [role]');
    console.log('Example: node scripts/make-admin.mjs user@example.com admin');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      console.log(`User with email ${email} not found. Creating new admin user...`);
      const newUser = new User({
        name: email.split('@')[0],
        email: email,
        role: role,
      });
      await newUser.save();
      console.log(`Successfully created and promoted user ${email} to role: ${role}`);
      return;
    }

    user.role = role;
    await user.save();

    console.log(`Successfully updated user ${user.name} (${user.email}) to role: ${role}`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

makeAdmin();
