const express = require('express');
const router = express.Router();

//route GET api/posts
//test route
//access Public
router.get('/',(req,res)=> res.send('Posts route'));

module.exports = router;