import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users", // Refers to the 'users' collection
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products", // Refers to the 'products' collection
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        hidden: {
          type: Boolean,
          default: false,  // Set default to false, meaning the review is not hidden initially
        },
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

const Review = mongoose.model("reviews", reviewSchema);

export default Review;