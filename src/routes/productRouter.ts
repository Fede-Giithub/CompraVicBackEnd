// EL ROUTER VALIDA METODOS Y RUTAS PROPIAS DE LA ENTIDAD

// GET http://localhost:3000/product

import { Router } from "express"
import productController from "../controllers/productController"
import userMiddleware from "../middleware/userMiddleware"
import upload from "../middleware/uploadMiddleware"

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL PRODUCTROUTER EMPIEZAN CON
// POST http://localhost:3000/products/

productRouter.get("/",productController.getAllProducts)
productRouter.get("/:id",productController.getProduct)
// Rutas solo para admin: productController, modificar y eliminar productos
productRouter.post("/", userMiddleware, upload.single("image"), productController.addProduct)
productRouter.patch("/:id", userMiddleware, productController.updateProduct)
productRouter.delete("/:id", userMiddleware, productController.deleteProduct)

export default productRouter