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

app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
    console.log("Another yelper joined the server")
    res.render("home.ejs")
})

// Todo: CRUD

// get
// Show all camps
app.get("/camps", async (req, res) => {
    const camps = await CampGroundModel.find({})
    res.render('camps.ejs', {campgrounds: camps})
})

// Create & New
// New
// Create new camps page - get
app.get("/camps/new", async (req, res) => {
    res.render("editCamp")
})
// Create
// Parse create new campground - post
app.post("/camps", async (req,res) => {
    console.log("Creating new camp:")
    console.log(req.body)
    const newCamp = new CampGroundModel({...req.body})
    await newCamp.save()
    res.redirect("/camps")
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