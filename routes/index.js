var express = require('express');
var router = express.Router();
var flash = require("connect-flash");
const localstrategy = require("passport-local");
const passport = require('passport');
const userModel = require('./users');
const jobModel = require("./jobs")
passport.use(new localstrategy(userModel.authenticate()));
const uploads = require("./multer");
const applicationschema = require('./applicationschema');

router.get('/', function(req, res, next) {
  res.render('index', { loggedin : true});
});

router.get('/login' , function(req,res){
  res.render("login")
});

router.get('/signin' ,function(req,res){
  res.render("signin");
});

router.get('/profile' , isLoggedIn ,async function(req , res ){
  let user = await userModel.findOne({
    username : req.session.passport.user
  }).populate('jobs').populate('appliedto');
  let jobs = await jobModel.find().populate("employerid");
  if(user.role === 'employer') res.render("employer" , { user , jobs})
  res.render('candidateprofile' , {user  , jobs})
});

router.post('/signin' , function(req,res){
  let user  = new userModel({
    username : req.body.username,
    email : req.body.Email,
    role : req.body.role
  });
  userModel.register(user , req.body.password).then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  }) 
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) { });

router.get('/logout' , function(req , res ){
  req.logOut(function(err) {
    if(err) {return  err};
    res.redirect('/')
  })
});

router.post('/job' , isLoggedIn,async function(req , res){
  let employer = await userModel.findOne({
    username : req.session.passport.user
  })
  let job = await jobModel.create({
    title : req.body.title ,
    description  : req.body.dec ,
    eligibility : req.body.eligibility ,
    employerid : employer._id
  });
  employer.jobs.push(job._id);
  await employer.save();
  res.redirect('/profile')
})


router.get("/apply/:id",isLoggedIn,async function(req,res){
  let job = await jobModel.findOne({_id : req.params.id})
  req.flash('id', job._id)
  res.render('apply' , {job});
})

router.post('/apply' , isLoggedIn , uploads.single("resume") ,async  function(req , res){
  let user = await userModel.findOne({username : req.session.passport.user});
  let application = await applicationschema.create({
    name : req.body.applicantname ,
    eduaction : req.body.edu ,
    about : req.body.aboutyou,
    skills : req.body.skills,
    email : req.body.applicantemail,
    resume : req.file.filename
  });
  const id = req.flash('id');
  let job = await jobModel.findOne({ _id : id});
  job.appliedby.push(application._id);
  await job.save()
  user.appliedto.push(application._id);
  await user.save();
  res.redirect("/profile")
});

router.get('/applicant/:id' , isLoggedIn ,async function(req, res){
  let job = await jobModel.findOne({_id : req.params.id}).populate('appliedby');
  req.flash('jobid' , job._id)
  res.render('applicantpage' , {job});
});

router.get('/edit/:id' , isLoggedIn ,async function(req, res){
  let job = await jobModel.findOne({_id : req.params.id}).populate('appliedby');
  req.flash('jobid' , job._id)
  res.render('edit' , {job});
});

router.post('/edit' , isLoggedIn , async function(req,res){
  let job = req.flash('jobid')
  await jobModel.findOneAndUpdate({_id : job},
    {
      title : req.body.title ,
    description  : req.body.dec ,
    eligibility : req.body.eligibility ,
    },
    {new : true }
  );
  res.redirect('/profile')
})

router.get('/delete/:id' , isLoggedIn , async function(req, res){
  await jobModel.findOneAndDelete({_id : req.params.id});
  res.redirect('/profile')
})

router.get('/reject/:id' , isLoggedIn , async (req,res)=>{
  await applicationschema.findOneAndDelete({_id : req.params.id});
  res.redirect('/profile')
})

router.get('/approve/:id' , isLoggedIn , async (req,res)=>{
  await applicationschema.findOneAndUpdate({_id : req.params.id},{status : true},{new:true});
  res.redirect('/profile')
})

function isLoggedIn( req , res , next){
  if(req.isAuthenticated()) return next() ;
  res.redirect('/login')
}

module.exports = router;
