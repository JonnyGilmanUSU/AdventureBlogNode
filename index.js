require('dotenv').config();
const path = require("path");
// Import Libraries
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const apiRouter = require('./routes/apiRoutes');
const authRouter = require('./routes/authRoutes');

// Database connection string
const MONGODB_URI=`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@adventureblog.jmcijyt.mongodb.net/${process.env.MONGODB_DEFAULT}?retryWrites=true&w=majority&appName=AdventureBlog`;
// Initialize session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});


// Initialize App
const app = express();

// Mount middleware to parse request bodies
app.use(cors({
    credentials: true
}));

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Register session middleware
app.use(
    session({
        secret:'mysecret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    next();
  })

// Register Routes
app.use(apiRouter);
app.use(authRouter);


mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3001, () => {console.log("Server running on 3001")});
    })
