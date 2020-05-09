const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const Schema = mongoose.Schema;
const productSchema = new Schema({
        name : {
            type:String,
            trim:true,
            required:true,
            maxlength:32,
            
        },
        description : {
            type:String,
            trim:true,
            required:true,
            maxlength:2000,
        },
        price : {
            type:Number,
            trim:true,
            required:true,
            maxlength:32,
            trim: true,
        },

        /*now every product has its own category which I dont want to create here coz We created it
        earlier in category.js so we need to link to Category schema
        */
        // for this we imported objectID above in the file
        category : {
            type : ObjectId,
            //from where we are pulling Category Schema
            ref : "Category",
            required:true
        },
        stock : {
            type:Number,
        },
        sold : {
            type:Number,
            default:0,
        },
        photo : {
            data : Buffer,
            contentType : String,
        }
    },
    {
    timestamps:true
    }
)

module.exports = mongoose.model("Product",productSchema);