const ServerConfig = require("./server_config.json")

const express = require("express")
const app = express()
const path = require("path")
const methodOverride = require("method-override")

const session = require("express-session")

const { MongoStore } = require('connect-mongo');

const MongoDBStore = require('connect-mongo')(session);

const mongoose = require("mongoose")
const CampGroundModel = require("./models/campground")
const UserModel = require("./models/user")

const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local") // Save locally

const campsRouter = require("./routes/camps")
const reviewsRouter = require("./routes/reviews")
const usersRouter = require("./routes/users")

const MongoDBUrl = ServerConfig.mongodb.SERVER_URL

mongoose.connect(MongoDBUrl, {
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
const MIN_IN_HOURS = 60
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30
const MILI_IN_MONTH = MILI_IN_SECONDS * SECONDS_IN_MIN * HOURS_IN_DAY * DAYS_IN_WEEK * DAYS_IN_MONTH

const store = new MongoDBStore({
    url: MongoDBUrl,
    secret: "DevSecretPass",
    touchAfter: SECONDS_IN_MIN * MIN_IN_HOURS * HOURS_IN_DAY
})

store.on("error", err => {
    console.log("Error occurred on connecting to mongodb store", err)
})

const sessionConfig = {
    store,
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

app.use(passport.initialize())
app.use(passport.session()) // For persistent login interface.
passport.use(new LocalStrategy(UserModel.authenticate()))

// Store and unstore in session
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())


app.use(flash())
app.use((req, res, next) => {
    res.locals.chosenUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    console.log(res.locals.success)
    console.log(res.locals.error)
    next()
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/camps', campsRouter)
app.use('/camps/:id/reviews', reviewsRouter)
app.use('/', usersRouter)

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