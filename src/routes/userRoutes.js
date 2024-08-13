const express = require("express");
const { registerUser,                       // To register the user
    loginUser,                              // To login the user
    logout,                                 // To logout the user
    getUserDatails,                         // To view the user's own profile
    updatePassword,                         // To reset the user's password    
    updateProfile,                          // To update the user's profile
    getAllUser,                             // To know the details of all users
    getSingleUser,                          // To know the details of the user
    updateUserData,                         // Admin to update user
    deleteUser,                             // Admin to Delete user
    forgotPassword,                         // To make the user forget the password
    resetpassword,                          // To reset the user after forgetting his password
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { currency } = require("../controller/updateCurrency");

const router = express.Router();


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/user


router.route("/register").post(registerUser);                                                   // OK

router.route("/login").post(loginUser);                                                         // OK

router.route("/logout").get(logout);                                                            // OK

router.route("/password/update").put(isAuthenticatedUser, updatePassword);                      // OK

router.route("/profile").get(isAuthenticatedUser, getUserDatails);                              // OK

router.route("/profile/update").put(isAuthenticatedUser, updateProfile);                        // OK

router.route("/change-currency").post(isAuthenticatedUser, currency);                             // OK

// -----------------------------------------------//
// ------------------ Admin side ---------------- //
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api/Admin

router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);           // OK

router.route("/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)                           // OK
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserData)                          // Ok
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);                          // Ok


// router.route("/password/forgot").post(forgotPassword);

// router.route("/password/reset/:token").put(resetpassword);



module.exports = router;