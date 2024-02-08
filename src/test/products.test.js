import mongoose from 'mongoose'
import Product from '../dao/mongo/products.mongo.js'
import Assert from 'assert'
import Chai from 'chai'
import Supertest from 'supertest'
import config from '../config/config.js' 

mongoose.connect(config.mongo_url);

const assert = Assert.strict
const expect = Chai.expect
const requester = Supertest("http://localhost:8080")

// Descripción general de las pruebas para el DAO de productos usando Mocha, Chai y SuperTest
describe('Testing Product DAO Mocha/Chai/SuperTest', () => {
    // Configuración inicial antes de las pruebas
    before(function () {
        this.productsDao = new Product()
    })

    // Prueba para verificar si se devuelven los productos de la base de datos
    it("Debería devolver los productos de la DB", async function () {
        this.timeout(5000)
        try {
            // Obtener productos de la base de datos
            const result = await this.productsDao.get()
            
            // Utilizar Mocha para afirmar que el resultado es un array
            assert.strictEqual(Array.isArray(result), true) // Mocha

            // Utilizar Chai para afirmar que el resultado es un array
            expect(Array.isArray(result)).to.be.equals(true) // Chai
        }
        catch (error) {
            console.error("Error durante el test: ", error)
            assert.fail("Test get producto con error")
        }
    })

    // Prueba para verificar si el DAO agrega un producto en la base de datos
    it("El DAO debe agregar un producto en la DB", async function () {
        let mockProduct = {
            description: "Test Description",
            image: "Test Image",
            price: 100000,
            stock: 10,
            category: "Test Category",
            availability: "in_stock",
            owner: "Test Owner"
        }
        // Agregar un producto a la base de datos
        const result = await this.productsDao.addProduct(mockProduct)

        // Utilizar Mocha para afirmar que el resultado tiene una propiedad '_id'
        assert.ok(result._id) // Mocha

        // Utilizar Chai para afirmar que el resultado tiene una propiedad '_id'
        expect(result).to.have.property('_id') // Chai
    })

    // Prueba para verificar si el DAO actualiza un producto en la base de datos
    it("El DAO debe actualizar un producto", async function () {
        let prodId = "652de4a6f3c6eefb11c6c61f"
        let mockProductUpd = {
            description: "Test description",
            image: "Test Image",
            price: 100000,
            stock: 10,
            category: "Test Category",
            availability: "Test Availability",
            owner: "Test Owner"
        }
        // Actualizar un producto en la base de datos
        const result = await this.productsDao.updateProduct(prodId, mockProductUpd)

        // Utilizar Mocha para afirmar que el resultado es un objeto
        assert.strictEqual(typeof result, "object") // Mocha

        // Utilizar Chai para afirmar que el resultado es un objeto
        expect(result).to.be.an('object') // Chai
    })

    // Prueba para verificar si el DAO elimina un producto de la base de datos
    it("El DAO debe eliminar un producto", async function () {
        let prodId = "652dee4ebacfec5d59647bd3" // Cambiar el id cada vez que se ejecute el test
        // Eliminar un producto de la base de datos
        const result = await this.productsDao.deleteProduct(prodId)

        // Utilizar Mocha para afirmar que el resultado es un objeto
        assert.strictEqual(typeof result, "object") // Mocha

        // Utilizar Chai para afirmar que el resultado es un objeto
        expect(result).to.be.an('object') // Chai
    })

    // Prueba para verificar si el endpoint GET /products devuelve todos los productos
    it("El endpoint GET /products debe devolver todos los productos", async function () {
        const response = await requester.get('/products')

        // Utilizar Mocha para afirmar que el código de estado HTTP es 200
        assert.strictEqual(response.status, 200)

        // Utilizar Chai para afirmar que el tipo de contenido de la respuesta es 'application/json'
        expect(response.type).to.equal('application/json')

        // Utilizar Chai para afirmar que la respuesta tiene una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success')
    })

    // Prueba para verificar si el endpoint POST /products crea un producto
    it("El endpoint POST /products debe crear un producto", async function () {
        let mockProduct = {
            description: "Apple",
            image: "Apple POST",
            price: 100000,
            stock: 7,
            category: "celulares",
            availability: "in_stock",
            owner: "asdribelb@gmail.com"
        }
        // Enviar una solicitud POST al endpoint /products con un nuevo producto
        const response = await requester.post('/products').send(mockProduct)

        // Utilizar Mocha para afirmar que el código de estado HTTP es 200
        assert.strictEqual(response.status, 200)

        // Utilizar Chai para afirmar que la respuesta es exitosa
        expect(response.ok).to.equal(true)

        // Utilizar Chai para afirmar que la respuesta tiene una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success')
    })

    // Acciones después de finalizar todas las pruebas
    after(function (done) {
        this.timeout(5000)
        console.log("Fin de las pruebas de Producto")
        done()
    })
})
