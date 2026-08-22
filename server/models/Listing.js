import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true,
    },
    productTypes: [{ type: String }],
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    priceRange: {
      min: {
        type: Number,
        required: [true, 'Minimum price estimate is required'],
        min: 0,
      },
      max: {
        type: Number,
        required: [true, 'Maximum price estimate is required'],
        min: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    estimatedTurnaround: {
      type: String,
      default: '1-3 days',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Listing = mongoose.model('Listing', listingSchema);
