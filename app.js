const ServerConfig = require("./server_config.json")

const express = require("express")
const app = express()
const path = require("path")
const methodOverride = require("method-override")

const session = require("express-session")

const mongoose = require("mongoose")
const CampGroundModel = require("./models/campground")
const ReviewModel = require("./models/review")

const flash = require("connect-flash")

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
app.use(methodOverride("_method"))

const MILI_IN_SECONDS = 1000
const SECONDS_IN_MIN = 60
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30
const MILI_IN_MONTH = MILI_IN_SECONDS * SECONDS_IN_MIN * HOURS_IN_DAY * DAYS_IN_WEEK * DAYS_IN_MONTH

const sessionConfig = {
    secret: "testyrestyyyyyyyyy!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + MILI_IN_MONTH,
        maxAge: MILI_IN_MONTH
    }
}

app.use(session(sessionConfig))

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
    console.log(camps)
    res.render('camps.ejs', {campgrounds: camps})
})

// Create & New
// New
// Create new camps page - get
app.get("/camps/new", async (req, res) => {
    res.render("newCamp")
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

// Read
// Get a specific camp - get
app.get("/camps/:id", async (req, res) => {
    const {id} = req.params;
    const chosenCamp = await CampGroundModel.findOne({_id: id}).populate("reviews")
    console.log(chosenCamp)
    res.render("showCamp", {camp: chosenCamp })
})

// Update & Edit
// Edit
// Get the edit form to update a camp
app.get("/camps/edit/:id", async (req, res) => {
    const {id} = req.params;
    const editedCamp = await CampGroundModel.findById(id)
    res.render("editCamp", {camp: editedCamp})
})
// Update
app.put("/camps/edit/:id", async (req, res) => {
    const {id} = req.params
    const editedCamp = await CampGroundModel.findByIdAndUpdate(id, {... req.body})
    res.redirect("/camps")
})


// Delete
app.delete("/camps/:id", async (req, res) => {
    const {id} = req.params
    await CampGroundModel.findByIdAndDelete(id)
    res.redirect("/camps")
})


/* Reviews CRUD */
// Create
app.post("/camps/:id/reviews", async (req, res) => {
    if (req.body.review == undefined) return;
    const ChosenReview = req.body.review
    console.log(ChosenReview)
    // if (ChosenReview.stars == undefined || ChosenReview.stars == undefined) return;
    console.log("Trying to add a review")
    console.log(ChosenReview)
    const NewReview = new ReviewModel(ChosenReview);
    const campground = await CampGroundModel.findById(req.params.id);
    campground.reviews.push(NewReview);
    await NewReview.save();
    await campground.save();
    res.redirect(`/camps/${campground._id}`);
})

app.delete("/camps/:id/reviews/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    console.log("Attempting to delete " + id)
    const DeletedReview = await ReviewModel.findByIdAndDelete(reviewId)
    console.log(DeletedReview)
    res.redirect(`/camps/${id}`)
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