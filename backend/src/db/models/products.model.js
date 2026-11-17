
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const productSchema = new Schema(
  {
    // Basic information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Classification
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    sections: {
      type: [String],
      default: [],
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    // Product media
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          alt: {
            type: String,
            default: "",
          },
        },
      ],
      validate: {
        validator: (images) => images.length > 0,
        message: "At least one product image is required.",
      },
    },

    // Inventory
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Product status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Ratings
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Location-based discovery
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: undefined,
      },

      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    // Ownership
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Text search
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

// Geospatial search
productSchema.index({
  location: "2dsphere",
});

// Reusable model
export const Product =
  models.Product || model("Product", productSchema);
