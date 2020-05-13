const User = require("../models/user")
const {Order} = require("../models/order")

//This method throws the user by his id and we are creating object profile inside request and
//storing the user inside it.
//MIDDLEWARE
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((error,user)=>{
        if(error || !user){
            return res.status(400).json({
                error: "No User found in DB"
            })
        }
        req.profile = user;
        next();
    })
}
//this method simply throws the user without id
exports.getUser = (req,res) => {
    //ALERT: We dont want to show salt, encry password,createdAt and updatedAt in get so set it to undefined
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

//this method updates the user profile 
exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        { $set:req.body},
        //new:true means hey database send me the object back that i just updated not the older one
        {new:true,useFindAndModify:false},
        (error,user)=>{
            if(error){
                return res.status(400).json({
                    error:"Error Updating the User, Try Signing in Again!",
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;
            return res.json(user);
            
        }
    )
}

//this method returns the purchase list of user
exports.userPurchaseList = (req,res) =>{
    //weird populate syntax
    Order.find({user:req.profile._id}).populate("user","_id name").exec(
        (error,order)=>{
            if(error){
                return res.status(400).json({
                    error:"No Order Found!",
                })
            }
            return res.json(order);

        }
    )
}

//method to Add order into the user purchase list
exports.pushOrderInPurchaseList = (req,res,next) =>{
    let purchases = [];
    req.body.order.products.forEach(
        product=>{
            purchases.push({
                _id:product._id,
                name:product.name,
                description: product.description,
                category:product.category,
                quantity:product.quantity,
                amount: req.body.order.amount,
                transaction_id:req.body.order.transaction_id,
            });
        });
    //store the purchases [] in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        //new:true means hey database send me the object that i just updated not the older one
        {new:true},
        (error,purchase) => {
            if(error){
                return res.status(400).json({
                    error:"Unable to update the Purchase List"
                });
            }
            next();
        }
    )    
    
}