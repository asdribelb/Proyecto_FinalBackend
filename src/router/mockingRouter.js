import express from "express";
import { productModel } from "../dao/mongo/models/products.model.js";
const router = express.Router();
const {faker} = require("@faker-js/faker");


// Crear productos simulados utilizando Faker
router.post("/mockingproducts", async (req, res) => {
    try {
    
       // Número de productos a generar
       const productsToGenerate = 100;
       const generatedProducts = [];


       // Generar productos de manera iterativa
       for (let i = 0; i < productsToGenerate; i++) {
           // Crear un producto falso con datos aleatorios
           const fakeProduct = {
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.datatype.number({ min: 100, max: 999 }),
                price: faker.commerce.price({ min: 5000, max: 20000, dec: 0 }),
                stock: faker.datatype.number({ min: 1, max: 100 }),
                category: faker.commerce.department(),
                thumbnails: faker.image.imageUrl(),
                quantity: faker.datatype.number({ min: 1, max: 10 })
            };

              // Agregar el producto generado al array
              generatedProducts.push(fakeProduct);
        }


       // Enviar la lista de productos generados como respuesta JSON
       res.json(generatedProducts);
    } catch (error) {
        // Manejar errores y enviar una respuesta con el código de estado 500
        console.error("Error al generar y guardar los productos simulados:", error.message);
        res.status(500).json({ error: "Error al generar y guardar los productos simulados" });
    }
});