import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../model/UserModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { createAuthSchema } from "../validators/authValidator"

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET!

class AuthController {
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
      
      const validator = createAuthSchema.safeParse(dataToValidate)
      
      if (!validator.success) {
              return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors });
        }
      const user = await User.findOne({ email })

      if (user) {
        return res.status(409).json({ success: false, error: "El usuario ya existe en la base de datos." })
      }

      // crear el hash de la contraseña
      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({ email, password: hash })

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
      
      const validator = createAuthSchema.safeParse(dataToValidate)
      
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

      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" })
      res.json({ success: true, token })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

export default AuthController