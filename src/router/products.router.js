import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService, userService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import {transport} from "../utils.js"

const router = Router()

const productMongo = new Products()

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        req.logger.info('Se cargan productos');
        let result = await productMongo.get()
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

// Ruta para obtener detalles de un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const prodId = req.params.id;
        const userEmail = req.query.email
        const productDetails = await productMongo.getProductById(prodId);
        res.render("viewDetails", { product: productDetails, email: userEmail });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        let { description, image, price, stock, category, availability, owner } = req.body

        // Si el dueño no está definido, se establece como 'admin@admin.cl'
        if (owner === undefined || owner == '') {
            owner = 'admin@admin.cl'
        }

        const product = { description, image, price, stock, category, availability, owner }

        // Validar campos obligatorios
        if (!description || !price) {
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
        }

        // Crear objeto DTO para el producto
        let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })

        // Verificar si el usuario es premium antes de crear el producto
        let userPremium = await userService.getRolUser(owner)
        if (userPremium == 'premium') {
            let result = await productService.createProduct(prod)
            res.status(200).send({ status: "success", payload: result });
            req.logger.info('Se crea producto con usuario premium');
        } else {
            req.logger.error("El owner debe contener usuarios premium");
            res.status(500).send({ status: "error", message: "Error interno del servidor" });
        }
    } catch (error) {
        req.logger.error("Error al comparar contraseñas: " + error.message);
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

// Ruta para eliminar un producto
router.delete('/:idProd', async (req, res) => {
    try {
        const idProducto = req.params.idProd;
        let ownerProd = await productMongo.getProductOwnerById(idProducto)
        let userRol = await userService.getRolUser(ownerProd.owner)

        // Si el dueño del producto es un usuario premium, enviar un correo antes de eliminar
        if (userRol == 'premium') {
            await transport.sendMail({
                from: 'asdribelb@gmail.com',
                to: ownerProd.owner,
                subject: 'Se elimina Producto con Owner Premium',
                html: `Se elimina producto con id ${idProducto} correctamente`,
            });
            res.status(200).json({ message: 'Producto eliminado con éxito.' });
        } else {
            // Si no es usuario premium, eliminar directamente
            productMongo.deleteProduct(idProducto)
            res.status(200).json({ message: 'Producto eliminado con éxito.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuarios.' });
    }
});

export default router
