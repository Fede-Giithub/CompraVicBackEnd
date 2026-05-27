import { Router } from "express"
import { generateText } from "ai"
import rateLimit from "express-rate-limit"
import openrouter from "../config/configai"
import Product from "../model/ProductModel" // 👈 ajustá el path

export const airouter = Router()

const limiter = rateLimit({
  windowMs: 1000 * 60 * 5,
  max: 5,
  message: {
    success: false,
    error: "Demasiadas solicitudes, intentá más tarde."
  }
})

airouter.use(limiter)

airouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body

    // Traemos los productos de la DB
    const productos = await Product.find().select("name description price stock category").lean()

    const { text } = await generateText({
      model: openrouter("nvidia/nemotron-3-super-120b-a12b:free"),
      system: `Sos el asistente virtual de CompraVic, una tienda online.
Respondé siempre en español y de forma amable y concisa.
Solo respondé preguntas relacionadas a la tienda y sus productos.
Si te preguntan algo que no tiene que ver con la tienda, redirigí la conversación.

Estos son los productos disponibles actualmente:
${JSON.stringify(productos, null, 2)}`,
      prompt: message
    })

    return res.json({
      success: true,
      reply: text
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      error: "Error con IA"
    })
  }
})