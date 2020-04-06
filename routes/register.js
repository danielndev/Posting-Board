const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

//Passport
router.use(passport.initialize());
router.use(passport.session());

require('../passportInit');

//Sign up
router.post('/signup', (req, res, next)=>{
    User.findOne({
        username: req.body.username
    },(err, user)=>{
        if(err){ return next(err)}
        if(user){ return next({message: "User already exists"})}

        var user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        });

      
        req.session.user = user;
        user.save()
        .then(data => {
            res.redirect('/main')
        })
        .catch(e =>{
            console.log(e);
        })
    });
});

router.post('/login',
            passport.authenticate('local', { successRedirect: '/main', failureRedirect: '/login-page' }),
            (req, res) => {
                req.session.user = user;
            });

module.exports = router;