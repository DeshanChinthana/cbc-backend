import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController';

const orderRouter = express.Router();

orderRouter.post("/", createOrder)
orderRouter.get("/", getOrders) 

export default orderRouter;