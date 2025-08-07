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