const express = require("express");
const router = express.Router();

const {getCategoryById,createCategory,getSingleCategory,getAllCategories,updateCategory,removeCategory} = require("../controllers/category")
const {isSignedIn,isAdmin,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//params
router.param("userId",getUserById)
router.param("categoryId",getCategoryById);


//actual routers goes here (create routes)
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)

//read category routes
router.get("/category/:categoryId",getSingleCategory);
router.get("/categories",getAllCategories);

//update Category
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)

//delete Category
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn,isAuthenticated,isAdmin,
    removeCategory
);








module.exports = router;