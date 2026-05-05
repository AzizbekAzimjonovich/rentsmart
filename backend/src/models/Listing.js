const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    address: { type: String, required: true, trim: true },
    rooms: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    images: [{ type: String }],
    contact: { type: String, required: true, trim: true },
    rentalType: {
      type: String,
      enum: ['apartment', 'house', 'room', 'studio', 'villa', 'other'],
      default: 'apartment',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', address: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
