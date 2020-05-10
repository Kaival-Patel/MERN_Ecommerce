    const mongoose = require("mongoose");
    const {ObjectId} = mongoose.Schema; 
    const Schema = mongoose.Schema;
    

    /*product cart schema is nothing but the cart we see in which we can increase the number 
    of quantity , then the price will get multiplied, there can be more than one quantity of 
    any single product we can have thats why we created Product Cart Schema
    */
    const ProductCartSchema = new Schema({
        product:{
            type:ObjectId,
            ref:"Product",
        },
        name:String,
        count: Number,
        price: Number,
    });

    const ProductCart = mongoose.model("ProductCart",ProductCartSchema)

    const OrderSchema = new Schema({
        products:[ProductCartSchema],
        transaction_id:{},
        amount:{
            type:Number,
        },
        address:{
            type:String,
            maxlength:2000,
        },
        updated:Date,
        user:{
            type:ObjectId,
            ref:"User",
        }
    },
    {timestamps:true}
);
const Order = mongoose.model("Order",OrderSchema);

module.exports = {Order,ProductCart};