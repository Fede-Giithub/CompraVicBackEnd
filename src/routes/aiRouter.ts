import { Router } from "express"
import { streamText } from "ai"
import rateLimit from "express-rate-limit"
import ProductModel from "../model/ProductModel"
import openrouter from "../config/configai"
export const airouter = Router()

const limiter = rateLimit({
  windowMs: 1000 * 60 * 5, // 5 minutos
  max: 5,
  message: {
    success: false,
    error: "Demasiadas solicitudes, intentá más tarde."
  },
  legacyHeaders: false,
  standardHeaders: "draft-8"
})

airouter.use(limiter)

airouter.get("/summary/:id", async (req, res) => {
    airouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Mensaje requerido"
      })
    }

    const result = await streamText({
      model: openrouter("meituan/longcat-flash-thinking-2601"),

      prompt: `
Sos un asistente virtual de un ecommerce.

Respondé de forma útil, breve y amigable.

Mensaje del usuario:
${message}
`
    })

    let fullResponse = ""

    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }

    return res.json({
      success: true,
      reply: fullResponse
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      error: "Error con IA"
    })
  }
})
  try {
    const { id } = req.params

    const product = await ProductModel.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      })
    }

    const prompt = `
Genera un resumen corto y atractivo del siguiente producto:

Título: ${product.name}

Descripción:
${product.description}
`

    res.setHeader(
      "Content-Type",
      "text/plain; charset=UTF-8"
    )

    const result = await streamText({
      model: openrouter("meituan/longcat-flash-thinking-2601"),
      prompt
    })

    return result.pipeTextStreamToResponse(res)

  } catch (error) {
    console.error(error)

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: "Error generando resumen"
      })
    }

    return res.end()
  }
})