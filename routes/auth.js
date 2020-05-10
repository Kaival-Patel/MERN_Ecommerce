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
const {signout} = require("../controllers/auth")


//GET method to signout the user!!
router.get("/signout",signout)





module.exports = router;