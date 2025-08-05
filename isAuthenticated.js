module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('error_msg', 'Sorry you need to Login first');
        res.redirect('/login')
    }
}

