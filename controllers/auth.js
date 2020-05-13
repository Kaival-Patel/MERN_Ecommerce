/*make sure whatever you have route file name its the same in controller here its
in routes/auth.js
*/
//methods to sign in, signout the user
//Alert Inorder to use the model to save the user info in signup import User Model
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const User = require("../models/user")
exports.signup = (req,res) =>{
    //here we are dealing with the custom errors we have worked so far in routes
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
            params:errors.array()[0].param,
        })
    }
    const user = new User(req.body);
    //fire callback to acknowledge the user if data is properly stored or not
    user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            err: "NOT able to save user in DB"
          });
        }
        res.json({
            name: user.name,
            email:user.email,
            id:user._id,
        });
      });
}

//here we used token and cookies
exports.signin = (req,res) =>{
    const {email,password} = req.body;
    //here we are dealing with the custom errors we have worked so far in routes
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg,
            params:errors.array()[0].param,
        })
    }
    User.findOne({email},(error,user)=>{
        if(error || !user){
            return res.status(400).json({
                error:"User doesn't exist, Please Signup first!"
            });
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and Password do not match!"
            });
        }

        //if we are here it means login creds are correct!
        //1) create Token
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        //2) put token in cookie,expire: =>expire date
        res.cookie("token",token,{expire:new Date()+9999});
        //3) send response to front end
        const {_id,name,email,role} = user;
        return res.json({
            token,
            user:{
                _id,name,email,role
            }
        })
    })
}

exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message:"User signed out Successfully"
    })
}


//protected Routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth",
});

//custom middlewares
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error:"Access Denied"
        });
    }
    next();
}

exports.isAdmin = (req,res,next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"You are not Admin, Access Denied"
        });
    }
    next();
}