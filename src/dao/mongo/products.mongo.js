import productsModel from './models/products.model.js'
import mongoose from 'mongoose'

export default class Products {
    constructor() {

    }

    get = async () => {
        let products = await productsModel.find().lean()
        return products
    }
    addProduct = async (prodData) => {
        try
        {
            let prodCreate = await productsModel.create(prodData);
            return prodCreate
        }catch(error){
            console.error('Error al crear producto:', error);
            return 'Error al crear producto';
        }      
    }
    updateProduct = async (prodId, prodData) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(prodId)) {
                return 'ID de producto no válido';
            }
            let updatedProduct = await productsModel.updateOne({ _id: new mongoose.Types.ObjectId(prodId) }, { $set: prodData });

        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return 'Error al actualizar producto';
        }
    }
    deleteProduct = async (productId) => {
        try {
            // Verificar si el ID es válido
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return 'ID de producto no válido';
            }
    
            // Eliminar el producto utilizando el ID
            let deletedProduct = await productsModel.deleteOne({ _id: new mongoose.Types.ObjectId(productId) });
    
            if (deletedProduct.deletedCount > 0) {
                // Si se eliminó al menos un producto, se considera exitoso
                return 'Producto eliminado exitosamente';
            } else {
                return 'No se encontró un producto con el ID proporcionado';
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return 'Error al eliminar producto';
        }
    };

    getProductById = async (id) => { 
        try 
        {
          //La propiedad lean() arregla el error own properties que se muestra al momento de querer mostrar datos desde mongoose, ya que,
          //viene con propiedades propias de mongoose y lean() se las quita para quedar solo el json
          const prod = await productsModel.findById(id).lean();    
          if (!prod) 
          {
            return 'Usuario no encontrado';
          }   
          return prod;
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
          return 'Error al obtener el usuario';
        }
    }
    getProductOwnerById = async (productId) => {
        try {
            const product = await productsModel.findById(productId).lean();
            if (!product) {
                return 'Producto no encontrado';
            }
    
            // Obtén el ID del owner del producto
            const ownerId = product.owner;
            // Verifica si se encontró el owner y formatea el resultado
            if (ownerId) {
                return {owner : ownerId}
            } else {
                return 'Owner no encontrado';
            }
        } catch (error) {
            console.error('Error al obtener el owner del producto:', error);
            return 'Error al obtener el owner del producto';
        }
    };
}