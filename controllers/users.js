const User = require('../models/user');


// brings to the register user page
module.exports.renderRegisterPage = (req,res)=>{
    res.render('users/registerPage')
}

//brings to the login page
module.exports.renderLoginPage = (req,res)=>{
    res.render('users/loginPage')
}

//logs in user
module.exports.loginUser = (req,res)=>{
    const redirectUrl = req.session.returnTo ||  '/campgrounds'
    delete req.session.returnTo
    req.flash('success','welcome back')
    res.redirect(redirectUrl)
}
//registers a new user 
module.exports.registerNewUser = async(req,res)=>{
    try{
        const { email , username ,password} = req.body
        const user = new User({ email, username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,error =>{
            if(error) return next(error);
            req.flash('success','Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })  
    } catch (error){
            req.flash('error',error.message);
            res.redirect('/register')
        }
    }

module.exports.userLogout = async(req,res,next)=>{
    try{
        req.logout(function (err) {
            if (err) {
              return next(err);
            }
            req.flash('success_msg', 'Goodbye!');
            res.redirect('/login');
          });
        req.flash('success',"Goodbye!") 
        res.redirect('/campgrounds')
    }catch (error){
        req.flash('error',error.message);
    }
}

