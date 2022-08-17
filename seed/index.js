
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const{ places, descriptors} = require('./seedHelpers')

const dbUrl ="mongodb+srv://RMeruelo:NXZjfqVWLjBgCJMJ@campfinder.xftjx.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(dbUrl, {
  useNewUrlParser    : true,
  useUnifiedTopology : true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const price = Math.floor(Math.random()*20)+10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '62fbb576487b94d6dd9a5f74',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry:{
              type:'Point',
              coordinates:[cities[random1000].longitude,cities[random1000].latitude]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images:[    
                {
                  url: 'https://res.cloudinary.com/darsztkcl/image/upload/v1650548185/CampFinder/qyeoqouiexdfgdktjwrs.jpg',
                  filename: 'CampFinder/qyeoqouiexdfgdktjwrs',
                },
                {
                  url: 'https://res.cloudinary.com/darsztkcl/image/upload/v1650548185/CampFinder/uhtneg2tmjdztztcbwen.jpg',
                  filename: 'CampFinder/uhtneg2tmjdztztcbwen',
                }
              ], 
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' ,
            price: price
        })
        await camp.save(); 
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})

