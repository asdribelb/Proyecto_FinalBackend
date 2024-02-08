import { Router } from "express";
import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";
import Users from "../dao/mongo/users.mongo.js"
import {transport, uploader} from "../utils.js"

const router = Router()

const usersMongo = new Users()

// Ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
      req.logger.info('Se cargan usuarios');
      let result = await usersMongo.get()
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      req.logger.error('Error al cargar usuarios');
      res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
  })
  
  // Ruta para crear un nuevo usuario
  router.post("/", async (req, res) => {
    try {
      let { first_name, last_name, email, age, password, rol } = req.body
      let user = new UserDTO({ first_name, last_name, email, age, password, rol })
      let result = await userService.createUser(user)
  
      // Verificar el resultado y responder adecuadamente
      if (result) {
        req.logger.info('Se crea Usuario correctamente');
      } else {
        req.logger.error("Error al crear Usuario");
      }
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
  })
  
  // Ruta para actualizar el rol del usuario a premium
  router.post("/premium/:uid", async (req, res) => {
    try {
      const { rol } = req.body;
      const allowedRoles = ['premium', 'admin', 'usuario'];
      const uid = req.params.uid;
  
      if (!allowedRoles.includes(rol)) {
        req.logger.error('Rol no válido proporcionado');
        return res.status(400).json({ error: 'Rol no válido' });
      }
  
      // Verifica si el usuario tiene los documentos requeridos
      if (!(await hasRequiredDocuments(uid))) {
        req.logger.error('El usuario no tiene los documentos requeridos para el rol premium');
        return res.status(400).json({ error: 'El usuario no tiene los documentos requeridos para el rol premium' });
      }
  
      let changeRol = await userService.updUserRol({ uid, rol });
  
      // Verificar el resultado y responder adecuadamente
      if (changeRol) {
        req.logger.info('Se actualiza rol correctamente');
        res.status(200).json({ message: 'Rol actualizado correctamente' });
      } else {
        req.logger.error('Error al actualizar el rol');
        res.status(500).json({ error: 'Error al actualizar el rol' });
      }
    } catch (error) {
      req.logger.error('Error en la ruta /premium/:uid');
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  })
  
  // Ruta para eliminar usuarios inactivos
  router.delete('/', async (req, res) => {
    try {
      // Fecha Actual
      const currentDate = new Date();
      const cutoffDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000); // Calculo de 2 dias para validar last_connection
  
      // Eliminar usuarios inactivos
      const result = await usersMongo.deleteUsersByFilter({ last_connection: { $lt: cutoffDate } });
  
      // Enviar correos electrónicos a los usuarios eliminados
      if (result.length > 0) {
        for (const userEmail of result) {
          await transport.sendMail({
            from: 'asdribelb@gmail.com',
            to: userEmail,
            subject: 'Eliminación de cuenta por inactividad',
            text: 'Tu cuenta ha sido eliminada debido a la inactividad.'
          });
        }
        res.status(200).json({ message: 'Usuarios eliminados con éxito.' });
      } else {
        res.status(500).json({ message: 'No se eliminaron usuarios por inactividad' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar usuarios.' });
    }
  })
  
  // Ruta para subir documentos del usuario
  const allFiles = [];
  router.post("/:uid/documents", uploader.fields([
    { name: 'profiles', maxCount: 2 },
    { name: 'products', maxCount: 2 },
    { name: 'documents', maxCount: 2 },
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobante_domicilio', maxCount: 1 },
    { name: 'comprobante_estado_cuenta', maxCount: 1 }
  ]), async (req, res) => {
    // Lógica para manejar la carga de archivos
    // ...
    res.send({ status: "success", message: "Archivos Guardados" });
  });
  
  export default router
  
