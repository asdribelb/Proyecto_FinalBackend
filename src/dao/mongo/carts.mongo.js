import cartsModel from './models/carts.model.js'
import productsModel from './models/products.model.js'

export default class Carts {
    constructor() {

    }

    get = async () => {
        let carts = await cartsModel.find()
        return carts
    }
    getCart = async (id_cart) => {
        try {
            // Obtener el carrito por su ID
            const cart = await cartsModel.findById(id_cart);

            // Verificar si el carrito existe
            if (!cart) {
                return { error: "No se encontró el carrito con el ID proporcionado" };
            }

            return { cart };
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            return { error: "Error interno al obtener el carrito" };
        }
    }
    getStock = async ({ productos }) => {
        try {
            const stockInfo = {};
            const errors = [];

            for (const producto of productos) {
                // Obtener el producto de la colección de productos
                const productInCollection = await productsModel.findOne({ description: producto.description });

                if (!productInCollection) {
                    errors.push({ description: producto.description, error: `El producto no se encuentra en la colección` });
                    stockInfo[producto.description] = { status: 'No encontrado en la colección' };
                    continue;
                }

                // Validar si hay suficiente stock
                if (productInCollection.stock >= producto.stock) {
                    // Restar el stock en la colección de productos
                    await productsModel.updateOne(
                        { description: productInCollection.description },
                        { $inc: { stock: -producto.stock } }
                    );

                    stockInfo[producto.description] = {
                        status: 'Suficiente',
                        availableQuantity: productInCollection.stock - producto.stock,
                        requiredQuantity: producto.stock,
                    };
                } else {
                    errors.push({ description: producto.description, error: 'Insuficiente' });
                    stockInfo[producto.description] = { status: 'Insuficiente' };
                }
            }

            if (errors.length > 0) {
                return { errors, stockInfo };
            }

            return stockInfo;
        } catch (error) {
            console.error("Error al obtener el stock:", error);
            return { error: "Error interno al obtener el stock" };
        }
    };
    getAmount = async ({ productos }) => {
        try {
            let totalAmount = 0;

            // Verifica que 'productos' sea definido y que sea un array
            if (!productos || !Array.isArray(productos)) {
                console.error('La propiedad "productos" no es un array válido.');
                return totalAmount;
            }

            for (const producto of productos) {
                totalAmount += producto.price * producto.stock;
            }

            return totalAmount;
        } catch (error) {
            console.error("Error al calcular el monto:", error);
            return 0;
        }
    };

    addCart = async (cart) => {
        try {
            let result = await cartsModel.create(cart);
            console.log("Carro creado correctamente");
            return result;
        } catch (error) {
            console.error("Error al agregar el carrito:", error);
            return { error: "Error interno al agregar el carrito" };
        }
    }

    addToCart = async (cartId, productId, quantity) => {
        try {
            if (typeof cartId !== 'string') {
                throw new Error('El cartId no es una cadena válida.');
            }
            // Convertir el cartId de cadena a ObjectId
            const cartObjectId = new mongoose.Types.ObjectId(cartId)
            // Buscar el carrito existente o crear uno nuevo si no existe
            let cart = await cartsModel.findById(cartObjectId)
            // Verificar si ya existe el producto en el carrito
            const existingProduct = cart.products.find(product => product.productId.equals(productId));

            if (existingProduct) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                existingProduct.quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({
                    productId: productId,
                    quantity: quantity,
                });
            }

            // Guardar los cambios en el carrito
            await cart.save();

            console.log("Producto agregado al carrito correctamente");
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw new Error('Error al agregar producto al carrito');
        }
    };
    getCartWithProducts = async (cartId) => {
        try {
            const cart = await cartsModel.findById(cartId).populate('products.productId').lean();
            if (!cart) {
                return 'Carrito no encontrado';
            }

            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito con productos:', error);
            return 'Error al obtener el carrito con productos';
        }
    }

}