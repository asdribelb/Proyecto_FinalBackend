import mongoose from 'mongoose'
import Ticket from '../dao/mongo/tickets.mongo.js'
import Assert from 'assert'
import Chai from 'chai'
import Supertest from 'supertest'
import config from '../config/config.js' 

mongoose.connect(config.mongo_url);

const assert = Assert.strict
const expect = Chai.expect
const requester = Supertest("http://localhost:8080")

// Descripción general de las pruebas para el DAO de tickets usando Mocha, Chai y SuperTest
describe('Testing Ticket DAO Mocha/Chai/SuperTest', () => {
    // Configuración inicial antes de las pruebas
    before(function () {
        this.ticketsDao = new Ticket()
    })

    // Prueba para verificar si se devuelven los tickets de la base de datos
    it("Debería devolver los tickets de la DB", async function () {
        this.timeout(5000)
        try {
            // Obtener tickets de la base de datos
            const result = await this.ticketsDao.get()
            
            // Utilizar Mocha para afirmar que el resultado es un array
            assert.strictEqual(Array.isArray(result), true) // Mocha

            // Utilizar Chai para afirmar que el resultado es un array
            expect(Array.isArray(result)).to.be.equals(true) // Chai
        }
        catch (error) {
            console.error("Error durante el test: ", error)
            assert.fail("Test get usuario con error")
        }
    })

    // Prueba para verificar si el DAO agrega un ticket en la base de datos
    it("El DAO debe agregar un Ticket en la DB", async function () {
        let mockTicket = {
            amount: 14785,
            purchaser: "testprueb1@gmail.com",
        }
        // Agregar un ticket a la base de datos
        const result = await this.ticketsDao.addTicket(mockTicket)

        // Utilizar Mocha para afirmar que el resultado tiene una propiedad '_id'
        assert.ok(result._id) // Mocha

        // Utilizar Chai para afirmar que el resultado tiene una propiedad '_id'
        expect(result).to.have.property('_id') // Chai
    })

    // Prueba para verificar si el endpoint GET /tickets devuelve todos los tickets
    it("El endpoint GET /tickets debe devolver todos los tickets", async function() {
        const response = await requester.get('/tickets')

        // Utilizar Mocha para afirmar que el código de estado HTTP es 200
        assert.strictEqual(response.status, 200)

        // Utilizar Chai para afirmar que el tipo de contenido de la respuesta es 'application/json'
        expect(response.type).to.equal('application/json')

        // Utilizar Chai para afirmar que la respuesta tiene una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success')
    })

    // Prueba para verificar si el endpoint POST /tickets crea un ticket
    it("El endpoint POST /tickets debe crear un ticket", async function() {
        let mockTicket = {
            amount: 14785,
            purchaser: "testprueba2@gmail.com",
        }
        // Enviar una solicitud POST al endpoint /tickets con un nuevo ticket
        const response = await requester.post('/tickets').send(mockTicket)

        // Utilizar Mocha para afirmar que el código de estado HTTP es 200
        assert.strictEqual(response.status, 200)

        // Utilizar Chai para afirmar que la respuesta es exitosa
        expect(response.ok).to.equal(true)

        // Utilizar Chai para afirmar que la respuesta tiene una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success')
    })

    // Acciones después de finalizar todas las pruebas
    after(function(done) {
        this.timeout(5000)
        console.log("Fin de las pruebas de Ticket")
        done()
    })
})

