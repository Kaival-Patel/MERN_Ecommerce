/*make sure whatever you have route file name its the same in controller here its
in routes/auth.js
*/
//methods to sign in, signout the user
//Alert Inorder to use the model to save the user info in signup import User Model
const { check, validationResult } = require('express-validator');
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


exports.signout = (req,res) => {
    res.json({
        message:"User wants to escape!!"
    })
}
