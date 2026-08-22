import mongoose from 'mongoose';

const repairRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
    productCategory: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    quote: {
      exactPrice: { type: Number },
      currency: { type: String, default: 'INR' },
      submissionDate: { type: Date },
      submissionTimeSlot: { type: String },
      estimatedDuration: { type: String },
      returnDate: { type: Date },
      returnTimeSlot: { type: String },
      technicianNotes: { type: String },
      quotedAt: { type: Date },
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
    rating: {
      score: { type: Number, min: 1, max: 5 },
      feedback: { type: String },
      ratedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const RepairRequest = mongoose.model('RepairRequest', repairRequestSchema);
