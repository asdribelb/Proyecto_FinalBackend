import mongoose from "mongoose"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    description: { type: String, max: 100},
    image: { type: String, max: 100},
    price: { type: Number},
    stock: { type: Number},
    category: { type: String, max: 50 }, // categoría
    availability: { type: String, enum: ['in_stock', 'out_of_stock'] }, // disponibilidad
    owner: { type: String, max: 70}
})

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel;