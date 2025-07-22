const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },

  async function(accessToken, refreshToken, profile, done) {

    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName || 'User',
      lastName: profile.name.familyName || 'Unknown',
      profileImage: profile.photos[0].value,
      createdAt: new Date() 
    };
    

    try{

      let user = await User.findOne({googleId: profile.id});

      if(user){
        done(null,user);
      }
      else{
        user = await User.create(newUser);
        done(null,user);
      }
    }
    catch(error){
      console.log(error);
    }
  }
));

//google login route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  //retrieve user data
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/',
    successRedirect: '/dashboard'
 }),
  );

  //route if something goes wrong
  router.get('/login-failure',(req,res) => {
    res.send('Something went wrong...')
  });

  //destroy session
  router.get('/logout', (req,res) => {
    req.session.destroy(error => {
      if(error){
        console.log(error);
        res.send('error login out');
      }
      else{
        res.redirect('/')
      }
    })
  })

  //persist user data after successful authentication
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  //retrieve user data from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

module.exports = router; 