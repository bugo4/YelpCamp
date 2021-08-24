const ServerConfig = require("./server_config.json")

const express = require("express")
const app = express()
const path = require("path")

const mongoose = require("mongoose")
const CampGroundModel = require("./models/campground")

mongoose.connect(ServerConfig.mongodb.SERVER_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
    console.log("Connected into Yelp Camp's database")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
    console.log("Another yelper joined the server")
    res.render("home.ejs")
})

// Just for testing - this route will be removed
app.get("/makecampground/:name", async (req, res) => {
    if (!req.params.name) return;
    const camp = new CampGroundModel({title: req.params.name})
    await camp.save()
    res.send(camp)
})


app.listen(ServerConfig.PORT, () => {
    console.log(`Serving on port ${ServerConfig.PORT}`)
})