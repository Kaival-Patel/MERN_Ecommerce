const express = require("express")
const router = express.Router();
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {getProductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product")


// all of params
router.param("userId",getUserById);
router.param("productId",getProductById);

// all of actual routes

//read routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)


//delete routes
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);


//update routes
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);


//listing routes
router.get("/products",getAllProducts);

//listing categories
router.get("/products/categories",getAllUniqueCategories);

module.exports = router;
