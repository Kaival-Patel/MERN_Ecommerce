//this is file for authentication routes

/*
ROUTING MECHANISM HERE :-
ROUTES   =>      AUTHENTICATION 
               /        |       \
    signup(POST)  signin(POST)  logout (GET)
*/ 

//import express and router
const express = require("express");
const router = express.Router();

//GET method to signout the user!!
router.get("/signout",(req,res)=>{
    res.send("OK Signing Out!")
});





module.exports = router;