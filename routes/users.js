const express = require('express')
const router = express.Router();

// * Mongoose Model 
const User = require('../models/users.js')

// * wrapAsync fn()
const wrapAsync = require('../utils/wrapAsync.js')

// * isAuthenticated fn()
const {saveRedirect_URL} = require('../middlewares.js')

// * custom class for error handling
const ExpressError = require('../utils/ExpressError.js');

// passport
const passport = require('passport')

router.get('/signup', (req, res)=>{
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res)=>{
    try{
        // naya user ko deconstruct kar rahe ha,
        const { username, email, password } = req.body
        // yaha se ek naya user bana rahe ha 
        const newUser = new User({email, username})
        // yaha pe User.register function use kar rahe ha jo basically hamare new user ko uska password ke sath database me save kar dega!
        const regUser = await User.register(newUser, password)
        // ye ha login function, ye leti ha user object ko or usko login karwa deti ha
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

router.post('/login', saveRedirect_URL, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success_msg', 'Welcome back to Roamify!');
    console.log("I'm loggged in FR")
    let newRedirect_URL = res.locals.redirect_URL || '/listings'
    res.redirect(newRedirect_URL);
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