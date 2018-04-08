'use strict'
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Service from '../models/services';
import { setUserInfo, getRole } from '../services/helpers';
import config from '../config';
import bcrypt from 'bcrypt-nodejs';


// Generate JWT token
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 9000 // in seconds
  });
}


// Login Route for industry 
exports.login = function (req, res, next) {
User.findOne({
    email: req.body.email  //body is the property of body-parser
  }, function(err, user) {
    if (err) throw err;


    if (!user) {
      res.status(401).send({success: false, msg: 'We are sorry. We do not recognise the email address or password. Please try again.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {

          // if user is found and password is right create a token
          const userInfo = setUserInfo(user);
          res.status(200).json({
            token: `JWT ${generateToken(userInfo)}`,
            user: user
          });
        } else {
          res.status(401).send({success: false, message: 'We are sorry. We do not recognise the email address or password. Please try again.'});
        }
      });
    }
  });

};


exports.addService = function (req, res, next){
  const userName = req.user.userName;
  
  User.findOne({ userName }, (err, existingUser) => {
    if (err)
      return next(err);

    if (existingUser) {
      const serviceName=req.body.serviceName;
     const industryID=req.user._id;
      
      const service = new Service({
      serviceName,
      industryID
    });

    service.save((err, service) => {
      if (err) return next(err);
      else {
      
      res.status(200).send({message: true, message: 'added successfully' });
    }
    
  });
  }
  else
  {
    res.status(200).send({message: true, message: 'user not recognised' });
  }

});
};

// delete service

exports.deleteService = function (req, res, next){
  // const _id=req.body._id; // _id is service id 
  const _id = '5ac922479d0c5418680503c6';
  

  Service.findByIdAndRemove(_id, function(err) {
        if (err)
             return next(err);
        else
             res.status(200).send({status: true, response: 'Service deleted successfully' });
    });
};

// update service

exports.updateService = function (req, res, next){
  // const _id=req.body._id; // _id is service id 
  const _id = '5ac922479d0c5418680503c6';
   const serviceName = req.body.serviceName;
  

Service.findOneAndUpdate({_id: _id}, {$set:{serviceName:serviceName}},function(err, doc){
    if(err){
         return next(err);
    }

     res.status(200).send({status: true, response: 'details updated successfully' });
});
};

// get all services

exports.getAllServices = function (req, res, next){
  const userName = req.user.userName;
  // console.log(req.user); return false;
  Service.find({ industryID:req.user._id }, (err, existingUser) => {
    if (err)
      return next(err);

    if (existingUser) {
      
    res.status(200).send({message: true, data: existingUser });
  
  }
  else
  {
    res.status(200).send({message: true, message: 'user not recognised' });
  }

});
};



// Registration Route for industry
exports.register = function (req, res, next) {
  
  const userName = req.body.userName;
  const password = req.body.password;
  const industryName=req.body.industryName;
  

  // Return error if no email provided
  if (!userName) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ userName }, (err, existingUser) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email address already registered.' });
    }


  

 // If email is unique and password was provided, create account
    const user = new User({
      userName,
      password,
      industryName
    });

    user.save((err, user) => {
      if (err) { return next(err);
    }

        // Respond with JWT if user was created

      const userInfo = setUserInfo(user);

      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};

