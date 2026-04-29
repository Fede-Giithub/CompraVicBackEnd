import { z } from "zod"

const authSchemaValidator = z.object({
  email: z.string().min(4,"error,el mail debe contener mas de 4 letras"),
  password: z.string().min(4,"error, la contrasenia debe tener mas de 4 letras")
})

export const createAuthSchema = authSchemaValidator

