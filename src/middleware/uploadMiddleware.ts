import multer from "multer"
import path from "node:path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads")
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + crypto.randomUUID()
    cb(null, name + path.extname(file.originalname))
  }
})

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    console.log(file.mimetype)
    cb(new Error("Solo se permiten imagenes"))
  }
}

const upload = multer({ storage, fileFilter })

export default upload