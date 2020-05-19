const Category = require("../models/category");
exports.getCategoryById = (req,res,next,id) =>{
   Category.findById(id).exec(
       (err,cat)=>{
           if(err){
               return res.status(400).json({
                    error:"Category not Found in DB"
               });
           }
           req.category = cat;
           next();
       }
   ) 
};

exports.createCategory = (req,res) =>{
    const category = new Category(req.body);
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                 error:"Problem Creating Category!"
            });
        }
        res.json({category});
    })
}

exports.getSingleCategory = (req,res) =>{
    return res.json(
        req.category
    );
};

exports.getAllCategories = (req,res) =>{
    Category.find().exec(
        (err,categories)=>{
            if(err){
                return res.status(400).json({
                     error:"No categories found!"
                });
            }
            res.json(categories);
        }
    )
};
exports.updateCategory = (req,res) =>{
    const category = req.category;
    category.name = req.body.name;
    category.save(
        (err,updatedCategory) =>{
            if(err){
                return res.status(400).json({
                    error:"Failed to Update Category"
                });
            }
            res.json(updatedCategory);
        }
    )
}
exports.removeCategory = (req,res) => {
    const category = req.category;
    category.remove(
        (error,category) =>{
            if(error){
                return res.status(400).json({
                    error:`Failed to Remove the ${removedcats}`
                });
            }
            res.json(category);
        }
       
    )
}
