//used to create the router file!
const express = require("express");

//used for encryping our passwords to be saved in the database!
//remeber we save password hashes not passwords themselves!
const bcrypt = require('bcryptjs');

//used to create and sign new JSON web tokens!
const jwt = require("jsonwebtoken");

//importing the User model so we can create a new user in the user docs
//in the db and retrieve the existing ones!

const User = require("../models/User.model");
const { restart } = require("nodemon");
//※ROOT path for this  is "/auth"
const router = express.Router();

const { isAuthenticated } = require('./../middleware/jwt.middleware.js');
const saltRounds = 12;

//※ROOT path for this  is "/auth"

//POST /auth/signup
router.post('/signup', (req, res, next) => {
    //below reflects the structure of the User model
    const {email, password, name} = req.body;

    //checks if either email, pass or name are an empty string and returns error if so
    if(email === '' || password === '' || name === '') {
        res.status(400).json({message: "REQUIRED: Fill in all fields!"})
    } 

    //Regex to validate if email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailRegex.test(email)) {
        res.status(400).json({message: 'Please provide an email address!'});
        return;
    }

    //Regex to force user to use at least 6 chars, at least 1 #, 1 lowercase and 1 uppercase letter
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({message: "Required: 6 chars, at least 1 of each: lowercase letter, uppercase letter, number"})
    }


    //Checks whether user with same email aready exists in he users colleciton in the db
    User.findOne({email})
    .then((foundUser) => {
        //If user with same email already exisits in db send erorr message
        if (foundUser) {
        res.status(400).json({message: "User already exists."});
        return; 
      }

      //if user with same email does not already exist make pass hash
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      //Makes new user in db with email and name like the user inputed and saves password key a "hashedPassword"
      return User.create({ email, password: hashedPassword, name});

    })
    .then((createdUser) => {
    // deconstruct newly made user obj and omit password
    const { email, name, _id } = createdUser;

    //create a new obj that doesn't include the password
     const user = {email, name, _id};


     //Send a json response containing the user obj
     res.status(201).json({user: user})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    })

})

//POST /auth/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

//makes sure email and password aren't left blank
if (email === "" || password === "") {
    res.status(400)
    .json({message: "Provide email and password"});
    return;
}

//Check wether user exists in dbF
User.findOne({email})
    .then((foundUser) => {

        if(!foundUser) {
        // If user not found, send an error response
        res.status(401).json({message: "User not found"})

        }

    // If user exists in db
    // hash password user provided then compare that hash to the one forthat user in the db. 
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if(passwordCorrect){
        //deconstruct user ojb omtting pass
        const {_id, email, name} = foundUser;

        //create obj that will be set as the token payload
        const payload = { _id, email, name };

        //create and sign token
        //JWT sign syntax jwt.sign(payload, secretKey, options)
        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            {algorithm: 'HS256', expiresIn: "6h"} // encryption algo defualt HS256  the 6h is readable by the ms package syntax
        );
            //send token as the response
        //TOKEN IS FULLY CREATED AND WE SENT IT -its gootd for 6hrs according to above
         res.status(200).json({ authToken: authToken});          

    }
        else {
            res.status(401)
            .json({message: "Can't authenticate user"});
        }




    }) 
    .catch(err => res.status(500)
    .json({message: "Oof! Interal Server Error"}))


})



//Get /auth/verify
router.get('/verify', isAuthenticated,  (req, res, next) => {       // <== CREATE NEW ROUTE
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
   
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
  });
   
   
  module.exports = router;