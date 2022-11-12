var express = require('express');
var router = express.Router();
var user=require('../models/user.schema');


/* GET users listing. */
router.get('/getAll',async function(req, res, next) {
  try{
    let userList = await user.find();
    res.send({message:'User Information Retreived Successfully ', users :  userList});
  }catch(err){
    console.log(err);
    res.send({message:'User informaion Retreival failed', error :  err.value});
  }
});


router.post('/add', function(req, res, next) {
  let newUser = new user({...req.body});
  newUser.save(function(err, newUser){
    if(err){
      res.send({message: err.message})
    }else{
      res.setHeader('Content-Type', 'application/json');
      res.send({message:'User Information saved successfully', newUserObj :  newUser});
    }
  });
  

});
router.put('/edit', async function(req, res, next) {
  try{
    const prevuser = req.body;
    let existingUser = await user.where("email").equals(prevuser.email).findOne();
    if(existingUser != null){
      existingUser.fullname = prevuser.fullname;
      existingUser.password = prevuser.password;
    }else{
      res.send({message: "Provided email id is not present in the database.Please check the email id" , prevuser});
    }
    await existingUser.save();
    res.send(existingUser);
  }catch(err){
    res.send({message: err.message});
  }
});


router.delete('/delete', async function(req, res, next) {
  try{
    console.log(req.query.email)
    const userEmail = req.query.email;
    let userr1=await user.where("email").equals(userEmail).deleteOne();
    res.send({message: "User Information successfully deleted",userr1});
  }catch(err){
    res.send({message: "User Information deltion failed"});
  }
});

module.exports = router;