const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

//shows all campgrounds
module.exports.index =async(req,res)=>{
    const campgrounds =  await Campground.find({})
    res.render('campgrounds/index',{ campgrounds })
  }

  //brings to create page
module.exports.renderNewPage = (req,res) =>{ 
    res.render('campgrounds/new')
}

//creates new campground
module.exports.createNewCampground =async (req,res,next)=>{
 const geodata = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()

  const camp = new Campground(req.body.campground)
  camp.geometry = geodata.body.features[0].geometry
  camp.images = req.files.map(f =>({url: f.path, filename: f.filename}))
  camp.author =req.user._id
  await camp.save();
  req.flash('success','Successfully made a new campground!')
  res.redirect(`/campgrounds/${camp._id}`)
}

//brings to campground edit page
module.exports.renderEditCamproundsPage =async(req,res)=>{
  const campground =  await Campground.findById(req.params.id)
  res.render('campgrounds/edit',{ campground })
}

//edits selected campground
module.exports.editCampground = async(req,res) =>{
  const camp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground})
  const imgs = req.files.map(f =>({url: f.path, filename: f.filename}))
  camp.images.push(...imgs)
  await camp.save()
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
     await camp.updateOne({$pull: {images:{ filename:{ $in: req.body.deleteImages}}}})
  }
  req.flash('success','Successfully updated the campground!')
  res.redirect(`/campgrounds/${camp._id}`)
}

// deletes selected campground
module.exports.deleteCampground = async (req,res)=>{
  const {id} = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success','Successfully deleted campground!')
  res.redirect('/campgrounds')
}

//brings to campground details page
module.exports.renderCampgroundDetailsPage = async(req,res)=>{
  const campground =  await (await Campground.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path: 'author'
    }

}).populate('author'))
  if(!campground){
    req.flash('error','Cannot find campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/details',{ campground })
}