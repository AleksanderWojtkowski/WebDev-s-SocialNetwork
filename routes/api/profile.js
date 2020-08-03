const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const request = require('request')
const config = require('config')
const {check,validationResult} = require('express-validator/check')
const User = require('../../models/User')
const Profile = require('../../models/Profile');
const { profile_url } = require('gravatar');

//route GET api/profile/me
//get current users profile
//access Private
router.get('/me',auth, async(req,res)=> {
  try {
      const profile = await  Profile.findOne({user: req.user.id}).populated('user',['name','avatar']);
    if(!profile){
        return res.status(400).json({msg:'There is no profile of this user'});

    }

    res.json(profile)

  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error')
  }
});
//route POST api/profile
//create or update profile
//access Private
router.post('/',[auth,[
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(500).json({errors:errors.array()})
    }

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;

      //Build profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills) {
          profileFields.skills = skills.split(',').map(skill=>(
              skill.trim()
          ))
      };
      //Build social object
      profileFields.social = {};
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(facebook) profileFields.social.facebook = facebook;
      if(linkedin) profileFields.social.linkedin = linkedin;
      if(instagram) profileFields.social.instagram = instagram;


    try {
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true});

                return res.json(profile)
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})
//route GET api/profile
//Get all profiles
//access Public
router.get('/',async(req,res)=>{
 try {
     const profiles = await Profile.find().populate('user',['name','avatar']);
     res.json(profiles)
 } catch (error) {
     console.error(error.message);
     res.status(500).send('Server Error')
 }
});
//route GET api/profile/user/:user_id
//Get profile by user id
//access Public
router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'There is no profile for this user'});


        res.json(profile)
    } catch (error) {
        console.error(error.message);
        if(error.kind === 'ObjectId'){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.status(500).send('Server Error')
    }
   });

//route DELETE api/profile
//DELETE profile,user and post 
//access Public
router.get('/',auth,async(req,res)=>{
    try {
        //remove profile
      
        await Profile.findOneAndRemove({user: req.user.id});

        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg:'User deleted'})
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
   });

//route PUT api/profile/experience
//Add profile xp
//access Private
router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    };

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };


    try {
        const profile = await Profile.findOne({user:req.user.id})

        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})
//route DELETE api/profile/experience/:exp_id
//DELETE profile exp
//access Private
router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        //get remove index
        const removeIndex = profile.experience
         .map(item=> item.id).indexOf(req.params.exp_id);
        
         profile.experience.splice(removeIndex,1);

         await profile.save();

         res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
//route PUT api/profile/education
//Add profile education
//access Private
router.put('/education',[auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
    check('fieldofstudy','Field of Study is required').not().isEmpty(),
    check('to','To date is required').not().isEmpty()
]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    };

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };


    try {
        const profile = await Profile.findOne({user:req.user.id})

        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})
//route DELETE api/profile/education/:edu_id
//DELETE profile edu
//access Private
router.delete('/education/:edu_id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        //get remove index
        const removeIndex = profile.education
         .map(item=> item.id).indexOf(req.params.edu_id);
        
         profile.education.splice(removeIndex,1);

         await profile.save();

         res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
//route GET api/profile/github/:username
//GET profile github
//access Public
router.get('/github/:username',auth,(req,res)=>{
   try {
       const options = {
           uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientid')}&client_secret=${config.get('githubSecret')}`,
           method:'GET',
           headers:{'user-agent':'node.js'}
       };

       request(options,(error,response,body)=>{
           if(error) console.error(error);
           
           if(response.statusCode !== 200){
              return res.status(404).json({msg:'Page not found'})
           }

           res.json(JSON.parse(body))
       })
   } catch (error) {
       console.error(error.message);
       res.status(500).send({msg:'Server Error'})
   }

})

 
module.exports = router;