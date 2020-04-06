const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const User = require('./models/User');
const Posts = require('./models/Posts');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));


app.use("/public", express.static(__dirname + "/public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(require('./routes'));


//Mongodb connection
mongoose.connect(
    process.env.MONGOOSE_ADDRESS,
    {   
    useNewUrlParser: true,
    useUnifiedTopology: true },
    (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Connected to db");
        }
});

//Screen renders
app.get('/', (req, res) => {
    res.render('index', {user: req.session.user});
});

app.get('/login-page', (req, res) => {
    res.render('login', {user: req.session.user});
});

app.get('/signout', (req, res) => {
    req.session.user = null;
    res.redirect('/login-page');
})

app.get('/main', async (req, res) => {
    var posts = await Posts.find({});


    if(req.session.passport){
        req.session.user = await User.findById(req.session.passport.user);
        req.session.passport = null;
    }

    res.render('main', {
    currentUser: req.session.user,
    posts: posts
    });

});

app.get('/user', (req, res) => {
    User.findOne({username: req.query.username}, async (err, user) => {
        if(err){
            res.send("Error");
        }else if(!user){
            res.render('userPage', {
                user: null,
                posts: [],
                following: null
            });
        }else{
            var userPosts = await Posts.find({user: user.username});
            
            var following = null;
            if(req.session.user.username != user.username){
                following = req.session.user.following.includes(user.username);
            }
           
            res.render('userPage', {
                user: user,
                posts: userPosts,
                following: following
            });

        }
    })
});



//Post requests



app.listen(3000, ()=>{
    console.log("Server is listening..");
});