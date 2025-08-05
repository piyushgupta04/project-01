const express = require('express')
const router = express.Router();

// * Mongoose Model 
const User = require('../models/users.js')

// * wrapAsync fn()
const wrapAsync = require('../utils/wrapAsync.js')

// * isAuthenticated fn()
const isAuthenticated = require('../isAuthenticated.js')

// * custom class for error handling
const ExpressError = require('../utils/ExpressError.js');

// passport
const passport = require('passport')

router.get('/signup', (req, res)=>{
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res)=>{
    try{
        const { username, email, password } = req.body
        const newUser = new User({email, username})
        const regUser = await User.register(newUser, password)
        req.login(regUser, (err)=>{
            if(err){
                return next(err)
            }        
            console.log(regUser)
            req.flash('success_msg', 'Welcome to Roamify!')
            res.redirect('/listings')
        })
    } catch (e) {
        req.flash('error_msg', e.message);
        res.redirect('/signup')
    }
}))

router.get('/login', (req, res)=>{
    res.render('users/login.ejs')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success_msg', 'Welcome back to Roamify!');
    console.log("I'm loggged in FR")
    res.redirect('/listings');
});

router.get('/logout', (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } else{
            req.flash('success_msg', 'Successfuly Logged Out')
            res.redirect('/listings')
        }
    })
})
module.exports = router