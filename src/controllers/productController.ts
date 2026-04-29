import { Request, Response } from "express"
import Product from "../model/ProductModel"
import { Types } from "mongoose"
import { createProductSchema, updateProductSchema } from "../validators/productValidator"

class productController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { name, stock, category, minPrice, maxPrice,user } = req.query
      console.log(req.query)

      const filter: any = {}

      if (name) filter.name = new RegExp(String(name), "i")
      if (stock) filter.stock = Number(stock)
      if (category) filter.category = new RegExp(String(category), "i")
      if (minPrice || maxPrice) {
        filter.price = {}
        // maxPrice -> si tengo precio máximo quiero un objeto con un precio menor
        if (minPrice) filter.price.$gte = minPrice
        // minPrice -> si tengo un precio mínimo quiero un objeto con un precio mas grande.
        if (maxPrice) filter.price.$lte = maxPrice
      }
       if (user) filter.user = new RegExp(String(user), "i")

      const products = await Product.find(filter)
      res.json({ success: true, data: products })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const productId = req.params.id as string

      if (!Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, error: "ID Inválido" })
      }

      const product = await Product.findById(productId)

      if (!product) {
        return res.status(404).json({ success: false, error: "Libro no encontrado" })
      }

      res.status(200).json({ success: true, data: product })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { body, file } = req

      const { name, description, price, category, stock,user } = body

      if (!name || !description || !price || !category || !stock || !user) {
        return res.status(400).json({ message: "Todos los campos son requeridos" })
      }

      const dataToValidate = {
        name,
        description,
        category,
        stock: +stock,
        price: +price,
        image: file?.path,
        user
      }

      const validator = createProductSchema.safeParse(dataToValidate)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const newProduct = new Product(validator.data)

      await newProduct.save()
      res.status(201).json({ success: true, data: newProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static updateProduct= async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const productId = req.params.id as string
      const { body } = req
      const userId = req.user?.id
      const userRole = req.user?.role

      if (!Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      // Buscar el producto primero
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      // Verificar permisos: admin puede modificar cualquier producto, usuario solo el suyo
      if (userRole !== "admin" && (product as any).user.toString() !== userId) {
        return res.status(403).json({ success: false, error: "No tienes permiso para modificar este producto" })
      }

      const validator = updateProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, validator.data, { new: true })

      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: "Libro no encontrado" })
      }

      res.json({ success: true, data: updatedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static deleteProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const productId = req.params.id as string
      const userId = req.user?.id
      const userRole = req.user?.role

      if (!Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      // Buscar el producto primero
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      // Verificar permisos: admin puede eliminar cualquier producto, usuario solo el suyo
      if (userRole !== "admin" && (product as any).user.toString() !== userId) {
        return res.status(403).json({ success: false, error: "No tienes permiso para eliminar este producto" })
      }

      const deletedProduct = await Product.findByIdAndDelete(productId)

      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: "Libro no encontrado" })
      }

      res.json({ success: true, data: deletedProduct })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ error: error.message })
    }
  }
}

export default productController