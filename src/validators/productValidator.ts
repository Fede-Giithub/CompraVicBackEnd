import { z } from "zod"

const productchemaValidator = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  price: z.number().min(10, "El valor debe ser mayor a 10"),
  category: z.string().min(2),  
  stock: z.number().positive(),
  image: z.string().default("No contiene imagen"),
})

export const createProductSchema = productchemaValidator

export const updateProductSchema = productchemaValidator.partial()