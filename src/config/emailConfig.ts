import nodemailer from "nodemailer"

const USER = process.env.EMAIL_USER
const PASS = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER,
    pass: PASS
  }
})

export default transporter