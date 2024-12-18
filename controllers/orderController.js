import Order from "../models/order.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

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

        const newOrderData = req.body; // Get the incoming order data from the request body.
        
        const newProductArray = []; // Initialize an empty array to store detailed product information.

        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const product = await Product.findOne({ // Find the product in the database using the productId from the request.
                productId: newOrderData.orderedItems[i].productId
            });

            if (!product) { // If the product is not found, send an error response and stop further execution.
                res.status(404).json({
                    message: `Product with the id ${newOrderData.orderedItems[i].productId} is not found` // An easy way to concatenation
                    // message: "Product with the id " + newOrderData.orderedItems[i].productId + " is not found"
                });
                return;
            }

            if (product.stock < newOrderData.orderedItems[i].quantity) { // Check if there is enough stock for the order
                res.status(400).json({
                    message: `Insufficient stock for product: ${product.productName}. Only ${product.stock} items are available.`
                });
                return;
            }

            product.stock -= newOrderData.orderedItems[i].quantity; // Decrease the product stock
            await product.save(); // Save the updated stock to the database

            newProductArray[i] = { // Create a new object for the product with the required fields
                name: product.productName,
                price: product.price,
                quantity: newOrderData.orderedItems[i].quantity,
                image: product.images[0]
            };
        }

        newOrderData.orderedItems = newProductArray; // Replace the orderedItems in the incoming data with the detailed product array.

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

export async function getOrders(req, res) {
    try {
        const orders = await Order.find({ email: req.user.email }) // get the orders which are email equal to the logged in user's email (That user's orders)
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}