

exports.mustLogin = function (req,res,next) {
    if(req.session.user){
        next();
    }else{
        req.flash('error','Please login first')
        res.redirect('/user/login')
    }
}
exports.mustNotLogin = function (req,res,next) {
    if(!req.session.user){
        next();
    }else{
        req.flash('error','you had login')
        res.redirect('back')
    }
}