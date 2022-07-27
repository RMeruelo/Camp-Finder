const {campgroundSchema, reviewsSchema} = require("./schemas.js")
const Campground = require('./models/campground');
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')


//checks user is logged in 
module.exports.isLoggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo  = req.originalUrl
        req.flash('error','You must be signed into access')
        return res.redirect('/login')
    }
    next()
}
// Joi schema check to makesure all submissions are valid
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
      const msg = error.details.map(error.message).join(',')
      throw new ExpressError(msg,400)
    } else{
      next();
    }
  }

// checks authorization of user
module.exports.isAuthor =  async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
   if(!campground.author.equals(req.user._id)){
     req.flash('error','You do not have permission for that')
     return res.redirect(`/campgrounds/${req.params.id}`)
   }
   next()
}
//checks author of review for authorization
module.exports.isReviewAuthor =  async (req,res,next)=>{
  const review = await Review.findById(req.params.reviewId)
 if(!review.author.equals(req.user._id)){
   req.flash('error','You do not have permission for that')
   return res.redirect(`/campgrounds/${req.params.id}`)
 }
 next()
}
// Joi schema check to makesure all submissions are valid
module.exports.validateReview= (req,res,next)=>{
  const {error} = reviewsSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el.message).join(',')
    throw new ExpressError(msg,400)
  } else{
    next();
  }
}
