const mongoose = require('mongoose')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true },
    password: String,
    role: String,
    _id: String
}, { versionKey: false })

const User = mongoose.model('User', userSchema)


module.exports = {
    async createUser(username, password, role) {
        const _id = mongoose.Types.ObjectId()
        const user = await User.create({username,password, role, _id})
        return user._doc
    },
    async loginUser(username) {
        return (await User.findOne({username}).exec())._doc
    },
    async getUserInformationById(id) {
        const user = await User.findOne({_id: id})
        return user
    },

    async clear() {
        return await User.deleteMany({})
    }
}