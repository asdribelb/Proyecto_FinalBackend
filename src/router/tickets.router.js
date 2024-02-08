import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

const router = Router()

const ticketMongo = new Tickets()

// Ruta para obtener todos los tickets
router.get("/", async (req, res) => {
    try {
        req.logger.info('Se obtiene lista de tickets');
        let result = await ticketMongo.get()
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.info('Error al obtener lista de tickets');
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

// Ruta para crear un nuevo ticket
router.post("/", async (req, res) => {
    try {
        let { amount, purchaser } = req.body

        // Crear objeto DTO para el ticket
        let tick = new TicketDTO({ amount, purchaser })

        // Crear el ticket usando el servicio correspondiente
        let result = await ticketService.createTicket(tick)

        // Verificar el resultado y responder adecuadamente
        if (result) {
            req.logger.info('Se crea ticket correctamente');
            res.status(200).send({ status: "success", payload: result });
        } else {
            req.logger.error("Error al crear ticket");
            res.status(500).send({ status: "error", message: "Error al crear ticket" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

export default router
