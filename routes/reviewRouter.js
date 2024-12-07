import express from 'express'
import { createReview, hideReview } from '../controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post("/", createReview)
reviewRouter.get("/", hideReview)

export default reviewRouter;