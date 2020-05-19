const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");


exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec(
       (err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Product not Found",
            })
        }
        req.product = product;
        next();
       } 
    );
}


exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(
        req,(err,fields,file)=>{
            if(err){
                res.status(400).json({
                    error:"Problem with form processing!"
                });
            }
            //destructure the fields
            /*=>it is equal to fields.price, fields.name, etc. So everytime we dont want to 
            call fields.name, fields.price etc blah blah
            */
            const {name,description,price,category,stock} = fields;

            //if any of the field is not filled then we gonna throw error.
            if(!name || !description || !price || !category || !stock){
                return res.status(400).json({
                    error:"Please fill out all the fields!"
                });
            }   
            
            let product = new Product(fields);

            //handle file
            if(file.photo){
                if(file.photo.size > 3145728){
                    return res.status(400).json({
                        error:"File Size too Big!"
                    })
                }
                product.photo.data = fs.readFileSync(file.photo.path);
                product.photo.contentType = file.photo.type
            }
            //save to db
            product.save(
                (err,product)=>{
                    if(err){
                       res.status(400).json({
                        error:"Error Creating Product!",
                       })
                    }
                    res.json(product);
                }
            )
        }
    )
}