const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/User');
const bcrypt = require('bcryptjs');

passport.use('local', new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password"
    }, (username, password, next) => {
        User.findOne({username: username}, (err, user) => {
      
            if(err) return next(err);
            if(!user || !bcrypt.compareSync(password, user.password)) return next ({message: "Email or password incorrect"})
            
            return next(null, user);
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});
