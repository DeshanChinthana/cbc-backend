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

export async function getProduct(req,res){
  try{
    const products = await Product.find()
    res.json(products)
  }catch(e){
    res.json({
      message : "Error Viewing Products"
    })
  }
}

export function deleteProduct(req, res) {

  Product.deleteOne({ name: req.params.name }).then(
    () => {
      res.json(
        {
          message: "Product deleted successfully"
        }
      )
    }
  ).catch(
    () => {
      res.json(
        {
          message: "Product not deleted"
        }
      )
    }
  )
}

export function getProductByName(req, res) {

  const name = req.params.name;

  Product.find({ name: name }).then(
    (productList) => {
      if (productList.length == 0) {
        res.json({
          message: "Product not found"
        })
      } else {
        res.json({
          list: productList
        })
      }
    }
  ).catch(
    () => {
      res.json({
        message: "Product not found"
      })
    }
  )

}