import Order from "../models/order";
import { isCustomer } from "./userController";

export async function createOrder(req, res) {
    try {
        // if(!isCustomer) can use if we know exactly the isCustomer is a boolean value.
        if (!isCustomer(req)) {
            return res.status(403).json({
                message: "Please login as customer to create orders"
            })
        }

        const latestOrder = await Order.find().sort({ date: -1 }).limit(1) // Fetches the most recent order by sorting all orders in descending order of the date field and limiting the result to the first record.

        let orderId

        if (latestOrder.length == 0) {
            orderId = "CBC1001"
        } else {
            const currentOrderId = latestOrder[0].orderId
            const numberString = currentOrderId.replace("CBC", "")
            const number = parseInt(numberString)
            const newNumber = (number + 1).toString();
            // const newNumber = (number + 1).toString().padStart(4, "0"); // No need to use padStart if orderId starts with 1 anyway from the begining
            orderId = "CBC" + newNumber
        }

        const newOrderData = req.body
        newOrderData.orderId = orderId // Combines the order ID and the user's email into the incoming order data (req.body) to prepare it for saving.
        newOrderData.email = req.user.email

        const order = new Order(newOrderData) // Creates a new Order object with the modified data and saves it to the database.
        await order.save()

        res.status(200).json({
            message: "Order created successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}