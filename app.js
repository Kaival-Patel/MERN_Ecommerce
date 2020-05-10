/*We can declare the port number as const port = 8000 but if someone from outside world seeing this
can do mischieves with our code as our port number is exposed to him/her , so for security purpose
it is good to have port numbers from env variables. For that we have installed dotenv package
from npm
*/

//we created .env file in this directory 
require('dotenv').config()


//importing mongoose,express,authRoutes
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");

//we are using these packages for middleware processing
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
/*lets say my domain is xyz.com, here we can surely do like "/logout" but its a good practice
that we access our backend with xyz.com/api/*anyroutes* that is through /api
now our Authentication routes will come from authRoutes
*/
app.use("/api",authRoutes);




//db Connections
mongoose.connect(process.env.DATABASE,
    {useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true,   
    }).then(
        ()=>{
            console.log("DB CONNECTED!!!!!");
        }
    ).catch(
        error=>console.log("Error Connecting db:"+error)
    )


//MiddleWares
app.use(bodyParser.json());    
app.use(cookieParser());    
app.use(cors());    


//PORT
const port = 8000;


//starting server
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
});