// EL ROUTER VALIDA METODOS Y RUTAS PROPIAS DE LA ENTIDAD

// GET http://localhost:3000/product

import { Router } from "express"
import BookController from "../controllers/productController"
import authMiddleware from "../middleware/userMiddleware"
import upload from "../middleware/uploadMiddleware"

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL PRODUCTROUTER EMPIEZAN CON
// POST http://localhost:3000/products/

productRouter.get("/",BookController.getAllProducts)
productRouter.get("/:id",BookController.getProduct)
productRouter.post("/", authMiddleware, upload.single("image"), BookController.addProduct)
productRouter.patch("/:id", authMiddleware, BookController.updateProduct)
productRouter.delete("/:id", authMiddleware, BookController.deleteProduct)

export default productRouter