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

        // validate product existence
        const product = await Product.findById(newReviewData.productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            })
        }

        // check if user already reviewed this product
        const existingReview = await Review.findOne({
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