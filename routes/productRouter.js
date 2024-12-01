import express from 'express';
import { createProduct, deleteProduct, getProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/',getProduct);

productRouter.get("/filter", (req,res)=>{
  res.json({
    message : "This is product Filtering area"
  })
})

productRouter.post('/',createProduct);
productRouter.delete('/:productName', deleteProduct);

// productRouter.get("/:name",getProductByName)

export default productRouter;