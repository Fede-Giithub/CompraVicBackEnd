import { model, Model, Schema } from "mongoose"
import IBook from "../interfaces/IProduct"

const ProductSchema = new Schema<IProduct> ({
    name:{type:String,required:true},
    description: { type: String, default: "No tiene descripción" },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, default: "No tiene categoria" },
  price: { type: Number, default: 0, min: 0 },
  image: { type: String },
})

