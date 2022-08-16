if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/darsztkcl/"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/darsztkcl/"
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/darsztkcl/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/darsztkcl/" ];

app.use(
  helmet.contentSecurityPolicy({
      directives : {
          defaultSrc : [],
          connectSrc : [ "'self'", ...connectSrcUrls ],
          scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
          styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
          workerSrc  : [ "'self'", "blob:" ],
          objectSrc  : [],
          imgSrc     : [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/darsztkcl/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
              "https://images.unsplash.com/"
          ],
          fontSrc    : [ "'self'", ...fontSrcUrls ],
          mediaSrc   : [ "https://res.cloudinary.com/darsztkcl/" ],
          childSrc   : [ "blob:" ]
      },
      crossOriginEmbedderPolicy: false
  })
);


const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize')


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const flash = require('connect-flash/lib/flash');


app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(mongoSanitize())

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const secret = process.env.SECRET || 'Thisisntthebestsecret'

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{ 
    secret: secret
  },
  touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
  console.log('Session Store Error')
})

const sessionConfig ={
  store,
  name:'CmpFr_lg',
  secret: secret,
  resave: false,
  saveUninitialized: true,
   cookie:{
     httpOnly:true,
     //secure:true,
     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
     httpOnly: true
   } 
}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false} ))

//passport User authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// connect to local database
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Database connected");
});


app.use((req,res,next)=>{
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// route grouping 
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
  res.render('campgrounds/home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
 })

 app.use((err,req,res,next)=>{
    const { statusCode = 500} = err;
    
    if(!err.message) err.message = 'something is wrong!'
    res.status(statusCode).render('error',{  err })
   
}) 


const port = process.env.PORT ||3000
app.listen( port,()=>{
    console.log( `Listening on ${port} `)
})

