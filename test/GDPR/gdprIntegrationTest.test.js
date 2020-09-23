const TodoListModel = require('../../models/TodoListModel')
const UserModel = require('../../models/UserModel')
const TodoModel = require('../../models/TodoModel')
const Database = require('../../database/dbConnection')

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { expect, request } = chai

const app = require('../../app')
require('dotenv').config()

const helper = require('../helper')


describe('todoList Integration Tests', function () {
    this.currentTest = {} 

    before(async function() {
        await Database.connect()
    })

    beforeEach(async function() {
        await UserModel.clear()
        await TodoListModel.clear()
        await TodoModel.clear()

        const user = await helper.generateTestUser()
        const token = await generateToken()

        this.currentTest.token = token
        this.currentTest.user = user
    })

    it('should get all user documentation', async function () {
        const newTodoList = await helper.generateTodoList(this.test.user._id)
        const newTodoList2 = await helper.generateTodoList(this.test.user._id)

        await helper.generateTodos(3, newTodoList._id, this.test.user._id)
        await helper.generateTodos(2, newTodoList2._id, this.test.user._id)

        await request(app)
        .get(`/userDocumentation`)
        .set('Authorization', `Bearer ${this.test.token}`)
        .set('Content-Type', `application/json`)
        .then(function (res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json

            expect(res.user).to.be.an('object')
            expect(res.user).to.have.keys(['username', 'password'])

            expect(res.todoLists.length).to.equal(2)
            expect(res.todoLists[0]).to.have.keys(['todos'])

            expect(res.todoLists[0].todos).to.equal(3)
        })
        .catch(function (err) {
            throw err;
         });    

    })
})