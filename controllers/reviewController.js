import Review from "../models/review.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

export async function createReview(req, res) {
    try {

        if (!isCustomer) { // Didn't use if(!isCustomer(req)) because, we know exactly the isCustomer is a boolean value.
            res.status(401).json({ // Unauthorized
                message: "Please login as a customer to give reviews."
            })
        }

        const newReviewData = req.body;
        const product = await Product.findById(newReviewData.productId) // validate product existence
        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        const existingReview = await Review.findOne({ // check if user already reviewed this product
            userId: newReviewData.userId,
            productId: newReviewData.productId
        })
        if (existingReview) {
            return res.status(409).json({ // 409 = conflict
                message: "You have already reviewed this product."
            })
        }

        const review = new Review(newReviewData)
        await review.save()

        res.status(200).json({
            message: "Review added successfully"
        })

    } catch (error) {
        req.status(500).json({
            message: error.message
        })
    }
}

export async function hideReview(req, res) {
    try {

        if (!isAdmin) { // Check if the user is an admin
            return res.status(401).json({
                message: "You must be an admin to hide reviews. Login as admin.",
            });
        }

        const reviewData = req.body // Extract review data from request body
        // const review = await Review.findById(reviewData.reiviewId)


    } catch (error) {
        req.status(500).json({
            message: error.message
        })
    }
}