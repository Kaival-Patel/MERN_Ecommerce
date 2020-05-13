//this is file for authentication routes

/*
ROUTING MECHANISM HERE :-
ROUTES   =>      AUTHENTICATION 
               /        |       \
    signup(POST)  signin(POST)  logout(GET)
*/ 

//import express, router and other methods from controller
var express = require("express");
var router = express.Router();
const {signout, signup , signin , isSignedIn} = require("../controllers/auth")
const {check} = require('express-validator')
//POST method is used to pass any data
/*while signing the user we want to check the validation like if email is not , say 'a.com' 
so inorder to do that we gonna implement a middleware , quit easy , visit express validator
https://express-validator.github.io/docs/custom-error-messages.html
*/
router.post(
    "/signup",
    [
        check("name","Name should be 3 characters long and must contains letters").isLength({min:3}).isAlpha("en-IN"),
        check("email","Please Enter Valid Email").isEmail(),
        check("password","Please Enter Password that contains numbers and alphabets with minimum 6 characters").isLength({min:6}).isAlpha("en-IN"),
    ],signup);

//signin route (POST)
/* ALERT:We gonna make user sign in through JSONWEBTOKEN (jwt) with the help of cookieparser
for more info : Check Out => https://courses.learncodeonline.in/learn/home/Full-Stack-MERN-Bootcamp/section/72123/lesson/369307
*/ 
router.post(
    "/signin",
    [
        check("email","Please Enter Valid Email").isEmail(),
        check("password","Password field is required").isLength({min:1}),
    ],signin);



//GET method (used to get any data) to signout the user!!
router.get("/signout",signout)

router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.auth);
});






module.exports = router;