const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require('uuid/v1');
const Schema = mongoose.Schema;


//creating new Schema for the user types
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim: true,        
    },
    lastname : {
        type:String,
        maxlength:32,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    userinfo:{
        type:String,
        trim:true,
    },
    
    encry_password:{
        type:String,
        required:true,
    },
    salt:String,
    role:{
        type:Number,
        default:0,
    },
    purchases: {
        type:Array,
        default:[],
    }
},
{
    timestamps:true,
}

);

//creating virtuals
//virtuals are kind of custom functions which are used to pull something from data 
/*ex: lets say you want domain name of emails you have in your database which contain
test@gmail.com,abc@yahoo.in etc here we can write the custom function to pull out the virtuals
//sample code to get domain 
// Create a virtual property `domain` that's computed from `email`.
userSchema.virtual('domain').get(function() {
  return this.email.slice(this.email.indexOf('@') + 1);
});
const User = mongoose.model('User', userSchema);

let doc = await User.create({ email: 'test@gmail.com' });

// `domain` is now a property on User documents.
doc.domain; 

*/

//this virtual generates the salt from uuid v1 which will be helpful to encrypt pwd using hash
userSchema.virtual("password")
        //getter and setter
        .set(function(password){
            this._password = password;
            this.salt = uuidv1();
            this.encry_password = this.securePassword(password)
        })
        .get(function(){
            return this._password;
        });

//before export we need to add method for encrypting the password!
userSchema.methods = {
    //we need to create the method authenticate for the users to login
    // here we only will return true or false
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword : function(plainpassword){
        //we have password type as String thats why we returned ""
        if(!plainpassword) return "";

        //now lets encrypt it....
        try {
            return crypto.createHmac('sha256',this.salt)
            .update(plainpassword).digest('hex');    
        } catch (error) {
            return "";
        }
    }
}

module.exports = mongoose.model("User",userSchema);