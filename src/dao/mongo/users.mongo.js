import usersModel from './models/users.model.js'

export default class Users {
    constructor() {

    }

    get = async () => {
        try {
            let users = await usersModel.find()
            return users
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return 'Error obtener usuarios';
        }
    }
    getUserById = async (id) => {
        try {
            //La propiedad lean() arregla el error own properties que se muestra al momento de querer mostrar datos desde mongoose, ya que,
            //viene con propiedades propias de mongoose y lean() se las quita para quedar solo el json
            const user = await usersModel.findById(id).lean();
            if (!user) {
                return 'Usuario no encontrado';
            }
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }
    findEmail = async (param) => {
        try {
            const user = await usersModel.findOne(param)
            return user
        } catch (error) {
            console.error('Error al buscar email:', error);
            return 'Error al buscar email de usuario';
        }

    }
    addUser = async (userData) => {
        try {
            let userCreate = await usersModel.create(userData);
            return userCreate
            console.log("Usuario creado correctamente")
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return 'Error al crear usuario';
        }
    }
    getUserRoleByEmail = async (email) => {
        try {
            // Buscar el usuario por correo electrónico en tu modelo de usuario
            const user = await usersModel.findOne({ email });

            // Verificar si se encontró un usuario y si tiene un rol premium
            if (user && user.rol === 'premium') {
                return 'premium'
            } else {
                return "usuario con otro rol"
            } ""
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
            return 'Error al obtener el rol del usuario';
        }
    };
    updatePassword = async (email, newPassword) => {
        try {
            const updatedUser = await usersModel.findOneAndUpdate(
                { email: email },
                { $set: { password: newPassword } },
                { new: true }
            );

            if (updatedUser) {
                return updatedUser;
            } else {
                console.error('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            return 'Error al actualizar la contraseña';
        }
    };

    updateLastConnection = async (email) => {
        try {
          const updatedUser = await usersModel.findOneAndUpdate(
            { email: email },
            { $set: { last_connection: new Date() } },
            { new: true }
          );
      
          if (updatedUser) {
            return updatedUser;
          } else {
            console.error('Usuario no encontrado');
            return null;
          }
        } catch (error) {
          console.error('Error al actualizar la última conexión:', error);
          throw error;
        }
      };
      updateIdCartUser = async ({email, newIdCart}) => {
        try {
          const updatedUser = await usersModel.findOneAndUpdate(
            { email: email },
            { $set: { id_cart: newIdCart } },
            { new: true }
          );
      
          if (updatedUser) {
            return updatedUser;
          } else {
            console.error('Usuario no encontrado');
            return null;
          }
        } catch (error) {
          console.error('Error al actualizar el id_Cart del usuario:', error);
          throw error;
        }
      };

    findJWT = async (filterFunction) => {
        try {
            const user = await usersModel.find(filterFunction)
            return user
        } catch (error) {
            console.error('Error al obtener filtro JWT:', error);
            return 'Error al obtener filtro JWT';
        }
    }
    getPasswordByEmail = async (email) => {
        try {
            const user = await usersModel.findOne({ email: email }).lean();

            if (user) {
                const pass = user.password;
                return pass;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    };
    getIdCartByEmailUser = async (email) => {
      try {
        // Buscar el usuario por correo electrónico en tu modelo de usuario
        const user = await usersModel.findOne({ email });
    
        // Verificar si se encontró un usuario y si tiene un rol premium
        if (user && user.id_cart) {
          return user.id_cart;
        } else {
            return null; // O cualquier valor que indique que no se encontró un carrito
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        return 'Error al obtener el rol del usuario';
      }
    };

    updatePassword = async (email, newPassword) => {
      try {
          const updatedUser = await usersModel.findOneAndUpdate(
              { email: email },
              { $set: { password: newPassword } },
              { new: true } 
          );
  
          if (updatedUser) {
              return updatedUser;
          } else {
              console.error('Usuario no encontrado');
          }
      } catch (error) {
          console.error('Error al actualizar la contraseña:', error);
          return 'Error al actualizar la contraseña';
      }
  };
  updateLastConnection = async (email) => {
    try {
      const updatedUser = await usersModel.findOneAndUpdate(
        { email: email },
        { $set: { last_connection: new Date() } },
        { new: true }
      );
  
      if (updatedUser) {
        return updatedUser;
      } else {
        console.error('Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar la última conexión:', error);
      throw error;
    }
  };
  updateIdCartUser = async ({email, newIdCart}) => {
    try {
      const updatedUser = await usersModel.findOneAndUpdate(
        { email: email },
        { $set: { id_cart: newIdCart } },
        { new: true }
      );
  
      if (updatedUser) {
        return updatedUser;
      } else {
        console.error('Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar el id_Cart del usuario:', error);
      throw error;
    }
  };
    findJWT = async (filterFunction) => {
        try
        {
            const user = await usersModel.find(filterFunction)
            return user
        }catch(error){
            console.error('Error al obtener filtro JWT:', error);
            return 'Error al obtener filtro JWT';
        }      
    }
    getPasswordByEmail = async (email) => {
        try {
          const user = await usersModel.findOne({ email: email }).lean();
      
          if (user) {
            const pass = user.password;
            return pass; 
          } else {
            return null; 
          }
        } catch (error) {
          console.error('Error al obtener el usuario:', error);
          return 'Error al obtener el usuario';
        }
      };

    updateUserRoleById = async ({ uid, rol }) => {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(
                uid,
                { $set: { rol: rol } },
                { new: true }
            );

            if (updatedUser) {
                return updatedUser;
            } else {
                console.error('Usuario no encontrado');
                return null; // o lanza una excepción según tus necesidades
            }
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            return 'Error al actualizar el rol';
        }
    };

    deleteUser = async (userId) => {
        try {
            // Extraer el valor del ID si es un objeto
            const idToDelete = typeof userId === 'object' ? userId.id : userId;
    
            // Eliminar el usuario utilizando el ID
            let deletedUser = await usersModel.deleteOne({ _id: idToDelete });
            return deletedUser;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return 'Error al eliminar usuario';
        }
      };
      deleteUsersByFilter = async (filter) => {
        try {
          // Obtener usuarios que coinciden con el filtro
          const usersToDelete = await usersModel.find(filter);

          // Obtener los correos electrónicos de los usuarios antes de eliminarlos
          const deletedUserEmails = usersToDelete.map(user => user.email);

          // Eliminar usuarios inactivos
          const result = await usersModel.deleteMany(filter);

          if (result.deletedCount > 0) {
            // Si se eliminó al menos un usuario, devolver los correos electrónicos
            return deletedUserEmails;
          } else {
            // No se eliminaron usuarios
            return [];
          }
        } catch (error) {
          console.error('Error al eliminar usuarios:', error);
          throw error;
        }
      };
      updateDocuments = async (userId, newDocuments) => {
        try {
          // Encuentra al usuario por su ID
          const user = await usersModel.findById(userId);
      
          if (!user) {
            console.error('Usuario no encontrado');
            return null;
          }
      
          // Asegúrate de que user.documents sea un array
          if (!Array.isArray(user.documents)) {
            user.documents = [];
          }
      
          // Agrega los nuevos documentos a la matriz existente
          user.documents.push(...(Array.isArray(newDocuments) ? newDocuments : [newDocuments]));
      
          // Guarda el usuario actualizado en la base de datos
          const updatedUser = await user.save();
      
          return updatedUser;
        } catch (error) {
          console.error('Error al actualizar los documentos:', error);
          throw error;
        }
      };
      hasRequiredDocuments = async (userId) => {
        try {
          // Encuentra al usuario por su ID
          const user = await usersModel.findById(userId);
      
          if (!user || !Array.isArray(user.documents)) {
            return false; // Devuelve false si el usuario no se encuentra o no tiene documentos
          }
      
          // Nombres de documentos requeridos
          const requiredDocumentNames = ['identificacion', 'comprobante_domicilio', 'comprobante_estado_cuenta'];
      
          // Verifica la presencia de cada documento requerido
          for (const requiredDocumentName of requiredDocumentNames) {
            const hasDocument = user.documents.some(doc => doc.name === requiredDocumentName);
            if (!hasDocument) {
              return false; // Devuelve false si falta al menos uno de los documentos requeridos
            }
          }
      
          return true; // Si todos los documentos requeridos están presentes, devuelve true
        } catch (error) {
          console.error('Error al verificar los documentos:', error);
          throw error;
        }
      };
}