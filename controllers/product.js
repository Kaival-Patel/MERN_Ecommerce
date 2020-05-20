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
            console.log(fields);
            console.log(file);
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
                console.log(product);
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
                    console.log(product);
                }
            )
            
        }
    )
}

exports.getProduct = (req,res) =>{
    req.product.photo = undefined
    return res.json(req.product);
    /*doing this is good , but when it comes to mp3,pdf,pictures which are bulky in size
    cannot be served in get request 
    return res.json(req.product)
    */
    
}


//middleware to parse photo alongwith loading the getProduct for quick response
exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();

}


//delete controller
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove(
        (err,deletedProduct) => {
            if(err){
                return res.status(400).json({
                    error:"Failed to delete this Product",
                })
            }
            res.json({
                message:"Successfully Deleted this Product",
                deletedProduct,
            });
        }
    );
}

//update Controller
exports.updateProduct = (req,res) => {
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
            console.log(fields);
            console.log(file);
            //if any of the field is not filled then we gonna throw error.
            if(!name || !description || !price || !category || !stock){
                return res.status(400).json({
                    error:"Please fill out all the fields!"
                });
            }   
            
            let product = req.product;

            //fields are populated(updated in product) by this lodash method
            product = _.extend(product, fields)

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
                        error:"Error Updating Product!",
                       })
                    }
                    res.json(product);
                    console.log(product);
                }
            )
            
        }
    )
}

//product Listing
exports.getAllProducts =(req,res) => {
    //default product show limit in one page is 8 if user doesn't pass
    //by default it will give the limit as string so parsing to int
    let showlimit = req.query.limit ? parseInt(req.query.limit) : 8;
    //taking sorting parameter
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find().
    select("-photo").
    //populating category
    populate("category").
    //sorting by ascending order
    sort([[sortBy, "asc"]]).
    limit(showlimit).
    exec(
        (err,products) => {
            if(err){
                res.status(400).json({
                    error:"Failed to get the Products"
                });
            }
            res.json(products)
        }
    )
};

//middleware to update the stock
//LOADING FKIN WEIRD SYNTAX
exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
            return {
                updateOne : {
                    filter : {_id:prod._id},
                    update : {$inc : {stock: -prod.count, sold: +prod.count}}
                } 
            }
        }
    );
    Product.bulkWrite(myOperations,
        {}, 
        (err,products) => {
            if(err){
                return res.status(400).json({
                    error:"Bulk Operation Failed"
                });
            }
            next();
        }
    )
}


//getting all the categories of the product
exports.getAllUniqueCategories = (req,res) => {
    Product.distinct(
        "category",
        {},
        (err,categories) => {
            if(err){
                res.status(400).json({
                    error:"Cannot Load All the Categories"
                })
            }
            res.json(categories);
        }
    )
}

