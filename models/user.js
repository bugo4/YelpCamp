const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.statics.doesUserExist = async function(username) {
    return await this.find({ username })
}

module.exports = mongoose.model("User", UserSchema)