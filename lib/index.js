"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
const Router = require("router");
const User = require("./lib/user");
const Metrics = require("./lib/metrics");
const router = Router();
const app = express();
/*const authRouter = express.Router()*/
const port = process.env.PORT || '3000';
//sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));
//connection to DB 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gfg');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("Connection succeeded");
    //populate the database with 3 users when starting the app
    var newUsers = [{ firstName: 'Mathieu', lastname: 'Claverie', username: 'Mat', password: '123' },
        { firstName: 'Alexandre', lastname: 'Loba', username: 'Alex', password: '456' },
        { firstName: 'Iandraina', lastname: 'Ravelomanana', username: 'Ian', password: '789' }];
    User.collection.insert(newUsers, function (err, savedUser) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Database populated');
        }
    });
});
//for body parser
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//template engine
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
//setting the server up
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`Server is running on http://localhost:${port}`);
});
//home page
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});
//registration page
app.get('/registration', (req, res) => {
    res.render('registration');
});
//login page
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    var username = req.body.userName;
    var password = req.body.pass;
    User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            console.log("identifiant non existant");
            res.render('login');
            return res.status(404).send();
        }
        //return res.status(200).send()
        res.render('myMetrics');
    });
});
//signup page
app.get('/signup', (req, res) => {
    res.render('registration');
});
app.post('/signup', (req, res) => {
    var firstName = req.body.fName;
    var lastname = req.body.lName;
    var username = req.body.userName;
    var password = req.body.pass;
    var newUser = new User();
    newUser.firstName = firstName;
    newUser.lastname = lastname;
    newUser.username = username;
    newUser.password = password;
    var defaulfMetrics = '11577231999';
    newUser.metrics.push(defaulfMetrics);
    newUser.save(function (err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        else {
            console.log(newUser._id);
            res.render('myMetrics');
            return res.status(200).send();
        }
    });
});
//myMetrics page
app.get('/myMetrics', (req, res) => {
    res.render('myMetrics');
});
//see metrics
app.get('/seeMetrics', (req, res) => {
    res.render('seeMetrics');
});
//get metrics
app.get('/addMetrics', (req, res) => {
    res.render('addMetrics');
});
app.post('/addMetrics', (req, res) => {
    //just for testing if it works with a precise _id
    User.findOne({ _id: "5e010b4958a0f43fb822781a" }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            console.log("identifiant non existant");
            res.render('addMetrics');
            return res.status(404).send();
        }
        var dateTime = req.body.date;
        var DTE = new Date(dateTime);
        var metrics = new Metrics();
        metrics.id_user = "5e010b4958a0f43fb822781a";
        metrics.timestamp = DTE.getTime();
        metrics.value = req.body.value;
        metrics.save(function (err, savedUser) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            else {
                res.render('myMetrics');
                return res.status(200).send();
            }
        });
        // console.log("ito ilay metric : ", metric)
        res.redirect('/myMetrics');
    });
});
//logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            }
            else {
                return res.redirect('/home');
            }
        });
    }
}),
    module.exports = app;
