import { model, Model, Schema } from "mongoose"
import Iproduct from "../interfaces/Iproduct"

const ProductSchema = new Schema<Iproduct> ({
    name:{type:String,required:true},
    description: { type: String, default: "No tiene descripción" },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, default: "No tiene categoria" },
    price: { type: Number, default: 0, min: 0 },
    image: { type: String },
}, {
  versionKey: false
})

const Product: Model<Iproduct> = model("Product", ProductSchema)

export default Product