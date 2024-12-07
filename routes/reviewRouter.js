import express from 'express'
import { createReview } from '../controllers/reviewController'

const reviewRouter = express.Router()

reviewRouter.post("/", createReview)

export default reviewRouter;