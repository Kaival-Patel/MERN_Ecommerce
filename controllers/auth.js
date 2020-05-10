/*make sure whatever you have route file name its the same in controller here its
in routes/auth.js
*/
//methods to sign in, signout the user
exports.signout = (req,res) => {
    res.json({
        message:"User wants to escape!!"
    })
}
