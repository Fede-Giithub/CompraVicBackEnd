import { Request, Response } from "express"
import transporter from "../config/emailConfig"
import createTemplate from "../templates/emailTemplate"

const emailService = async (req: Request, res: Response) => {
  const { subject, email: emailUser, message } = req.body

  if (!subject || !emailUser || !message) {
    return res.status(400).json({ success: false, message: "Data invalida" })
  }

  try {
    const info = await transporter.sendMail({
      from: `Mensaje de la tienda: ${emailUser}`,
      to: process.env.EMAIL_USER,
      subject,
      html: createTemplate(emailUser, message)
    })

    res.json({ succes: true, message: "Has creado tu cuenta!.", info })

  } catch (e) {
    const error = e as Error
    res.status(500).json({ success: false, error: error.message })
  }
}

export default emailService