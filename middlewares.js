// required mongoose listing schema
const Listing = require("./models/listing");

// * Joi's validation schema
const {joi_listingSchema} = require('./schema.js')

// * custom class for error handling
const ExpressError = require('./utils/ExpressError.js')

// * Joi's Validation schema
const {joi_reviewSchema} = require('./schema.js')

// * isLoggedIn middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        req.session.redirect_URL = req.originalUrl
        req.flash('error_msg', 'Sorry you need to Login first');
        res.redirect('/login')
    }
}

// Strategy Behind the Code: Route definition mein humne isLoggedIn ko doosre argument ki tarah pass kiya hai. Express isse ek middleware ki tarah treat karega. Iska matlab hai ki (req, res) => { ... } wala function tab tak nahi chalega jab tak isLoggedIn function ke andar next() call na ho jaaye.

module.exports.saveRedirect_URL = (req, res, next) => {
    if(req.session.redirect_URL){
        res.locals.redirect_URL = req.session.redirect_URL;
    }
    next();
}

module.exports.isOwner_listing = async (req, res, next) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.current_user._id)) {
        req.flash('error_msg', "Sorry, You are not the owner of this listing!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


// * Joi's validation fn() 
module.exports.validateListing = (req, res, next) => {
  let { error } = joi_listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
}

// * Joi's validation function
module.exports.validateReview = (req, res, next) => {
  let {error} = joi_reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }
  next()
}