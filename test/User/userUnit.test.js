const UserModel = require('../../models/UserModel')
const Database = require('../../database/dbConnection')

require('chai').should();
require('dotenv').config()

const helper = require('../helper')


describe('todoList Unit Tests', () => {
    this.currentTest = {}

    before(async function() {
        await Database.connect()
    })

    beforeEach(async function() {
        await UserModel.clear()

        const user = await helper.generateTestUser()
        this.currentTest.user = user
    })

    it('should get user information', async function() {
        const user = await UserModel.getUserInformationById(this.user._id)

        user.should.be.an('object')
        user.username.should.equal(this.user.username)
        user.password.should.equal(this.user.password)
    })
})