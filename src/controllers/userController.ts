import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { createUserSchema } from "../validators/userValidator"

dotenv.config({ path: "./src/.env" })

const SECRET_KEY = process.env.JWT_SECRET!

class UserController {
  // http://localhost:3000/auth/register
  // method: POST
  // body: {"email": "gabi@gmail.com", "password": pepe123}
  static register = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Todos los campos son requeridos" })
      }
      const dataToValidate = {
              email,
              password 
            }
      
      const validator = createUserSchema.safeParse(dataToValidate)
      
      if (!validator.success) {
              return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
        }
      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos." })
      }

      // crear el hash de la contraseña
      const hash = await bcrypt.hash(password, 10)
      
      // Por defecto el rol es "user", solo se puede asignar "admin" si se indica
      const role: "user" | "admin" = "user"
      const newUser = new User({ email, password: hash, role })

      await newUser.save()
      res.status(201).json({ success: true, data: newUser })
    } catch (e) {
      const error = e as Error
      switch (error.name) {
        case "MongoServerError":
          return res.status(409).json({ success: false, error: "Usuario ya existente en nuestra base de datos" })
      }
    }
  }

  static login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Todos los campos son requeridos" })
      }
      const dataToValidate = {
              email,
              password 
            }
      
      const validator = createUserSchema.safeParse(dataToValidate)
      
      if (!validator.success) {
              return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
        }
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      // validar la contraseña
      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return res.status(401).json({ success: false, error: "No autorizado" })
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ success: true, token, role: user.role })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // http://localhost:3000/auth/create-admin
  // method: POST
  // body: {"email": "admin@gmail.com", "password": "admin123"}
  // Solo un admin puede crear otro admin
  static createAdmin = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const userRole = req.user?.role

      // Verificar que quien hace la petición es admin
      if (userRole !== "admin") {
        return res.status(403).json({ success: false, error: "Solo un administrador puede crear otros administradores" })
      }

      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Todos los campos son requeridos" })
      }

      const validator = createUserSchema.safeParse({ email, password })

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors })
      }

      const existingUser = await User.findOne({ email })

      if (existingUser) {
        return res.status(409).json({ success: false, error: "El usuario ya existe" })
      }

      const hash = await bcrypt.hash(password, 10)
      const newAdmin = new User({ email, password: hash, role: "admin" })

      await newAdmin.save()
      res.status(201).json({ success: true, message: "Administrador creado exitosamente", data: { email, role: "admin" } })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default UserController