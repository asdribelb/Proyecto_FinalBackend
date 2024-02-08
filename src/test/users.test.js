import mongoose from 'mongoose'
import User from '../dao/mongo/users.mongo.js'
import Assert from 'assert'
import Chai from 'chai'
import Supertest from 'supertest'
import config from '../config/config.js' 

mongoose.connect(config.mongo_url);

const assert = Assert.strict;
const expect = Chai.expect;
const requester = Supertest("http://localhost:8080");

// Suite de pruebas para el DAO de Usuario
describe('Testing User DAO Mocha/Chai/SuperTest', () => {
    // Configuración antes de las pruebas
    before(function () {
        this.usersDao = new User(); // Inicializar el DAO de Usuario
    });

    // Prueba: Devolver los usuarios de la base de datos
    it("Debería devolver los usuarios de la DB", async function () {
        this.timeout(5000);
        try {
            const result = await this.usersDao.get();
            assert.strictEqual(Array.isArray(result), true); // Mocha
            expect(Array.isArray(result)).to.be.equals(true); // Chai
        } catch (error) {
            console.error("Error durante el test: ", error);
            assert.fail("Test get usuario con error");
        }
    });

    // Prueba: Agregar un usuario en la base de datos
    it("El DAO debe agregar a un usuario en la DB", async function () {
        let mockUser = {
            first_name: "Test First Name",
            last_name: "Test Last Name",
            email: "Test Email",
            age: 20,
            password: "Test Pass",
            rol: "Test Rol"
        };
        const result = await this.usersDao.addUser(mockUser);
        assert.ok(result._id); // Mocha
        expect(result).to.have.property('_id'); // Chai
    });

    // Prueba: Devolver un usuario después de colocar un correo
    it("El DAO debe devolver un usuario después de colocar un correo", async function () {
        let emailToFind = "asdribelbn@gmail.com";
        const result = await this.usersDao.findEmail({ email: emailToFind });
        assert.strictEqual(typeof result, "object"); // Mocha
        expect(result).to.be.an('object'); // Chai
    });

    // Prueba: Devolver un usuario después de colocar un parámetro cualquiera
    it("El DAO debe devolver un usuario después de colocar un parámetro cualquiera", async function () {
        let filterData = { first_name: 'admin' };
        const result = await this.usersDao.findJWT(filterData);
        assert.strictEqual(typeof result, "object"); // Mocha
        expect(result).to.be.an('array'); // Chai
    });

    // Prueba: Endpoint GET /users debe devolver todos los usuarios
    it("El endpoint GET /users debe devolver todos los usuarios", async function() {
        const response = await requester.get('/users');
        // Verifica el código de estado HTTP
        assert.strictEqual(response.status, 200);
        // Verifica el tipo de contenido de la respuesta
        expect(response.type).to.equal('application/json');
        // Verifica que la respuesta tenga una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success');
    });

    // Prueba: Endpoint POST /users debe crear un usuario
    it("El endpoint POST /users debe crear un usuario", async function() {
        let mockUser = {
            first_name: "SuperTest First Name",
            last_name: "SuperTest Last Name",
            email: "SuperTest Email",
            age: 20,
            password: "SuperTest Pass",
            rol: "SuperTest Rol"
        };

        const response = await requester.post('/users').send(mockUser);
        // Verifica el código de estado HTTP
        assert.strictEqual(response.status, 200);
        // Verifica el tipo de contenido de la respuesta
        expect(response.ok).to.equal(true);
        // Verifica que la respuesta tenga una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success');
    });

    // Configuración después de las pruebas
    after(function(done) {
        this.timeout(5000);
        console.log("Fin de las pruebas de Usuario");
        done();
    });
});
