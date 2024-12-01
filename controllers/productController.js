import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {
  try {
    if (!isAdmin(req)) { // Check if the user is an administrator
      return res.json({
        message: "Please login as administrator to add products",
      });
    }

    const newProductData = req.body; // Extract product data from the request body
    const product = new Product(newProductData); // Create a new product instance
    await product.save(); // Save the product to the database

    res.json({
      message: "Product created",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the product",
      error: error.message,
    });
  }
}

export async function getProduct(req, res) {
  try {
    const products = await Product.find(); // Fetch all products from the database    
    res.status(200).json(products); // Respond with the fetched products
  } catch (error) {
    res.status(500).json({ // Handle errors and respond with an appropriate status code and message
      message: "Error viewing products",
      error: error.message, // Provide error details for debugging
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    // Extract product name from request parameters
    const productName = req.params.productName; // Ensure the key matches what you use in routes
    const result = await Product.deleteOne({ productName: productName }); // Pass the correct query object to deleteOne

    if (result.deletedCount === 0) { // Check if a product was actually deleted
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the product",
      error: error.message, // Provide error details for debugging
    });
  }
}

// export function getProductByName(req, res) {
//   const name = req.params.name;
//   Product.find({ name: name }).then(
//     (productList) => {
//       if (productList.length == 0) {
//         res.json({
//           message: "Product not found"
//         })
//       } else {
//         res.json({
//           list: productList
//         })
//       }
//     }
//   ).catch(
//     () => {
//       res.json({
//         message: "Product not found"
//       })
//     }
//   )
// }