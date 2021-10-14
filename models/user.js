const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
// Adds username and passport to User Schema
UserSchema.plugin(passportLocalMongoose)

UserSchema.statics.doesUserExist = async function(username) {
    return await this.find({ username })
}

module.exports = mongoose.model("User", UserSchema)