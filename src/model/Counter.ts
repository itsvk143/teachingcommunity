import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // The entity name (e.g., 'teacher', 'coaching', 'non-teacher')
  seq: { type: Number, default: 10000000 } // Start from 10,000,000
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

export default Counter;
