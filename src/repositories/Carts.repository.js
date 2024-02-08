import CartDTO from "../dao/DTOs/cart.dto.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  // Obtiene todos los carritos
  getCarts = async () => {
    try {
      const result = await this.dao.get();
      return result;
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      return { error: "Error interno al obtener los carritos" };
    }
  }

  // Obtiene el monto total del carrito
  getAmount = async ({ productos }) => {
    try {
      const result = await this.dao.getAmount({ productos });
      return result;
    } catch (error) {
      console.error("Error al obtener el monto del carrito:", error);
      return { error: "Error interno al obtener el monto del carrito" };
    }
  }

  // Valida un carrito por su ID
  validateCart = async (id_cart) => {
    console.log("Entra al validateCart");
    try {
      const result = await this.dao.getCart(id_cart);
      return result;
    } catch (error) {
      console.error("Error al validar el carrito:", error);
      return { error: "Error interno al validar el carrito" };
    }
  }

  // Valida el stock de productos en el carrito
  validateStock = async ({ productos }) => {
    try {
      const result = await this.dao.getStock({ productos });
      return result;
    } catch (error) {
      console.error("Error al validar el stock del carrito:", error);
      return { error: "Error interno al validar el stock del carrito" };
    }
  }

  // Crea un nuevo carrito
  createCart = async (cart) => {
    try {
      const cartToInsert = new CartDTO(cart);
      const result = await this.dao.addCart(cartToInsert);
      return result;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      return { error: "Error interno al crear el carrito" };
    }
  }
}


