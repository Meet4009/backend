const express = require("express");
const router = express.Router();

const { registerUser,                       // To register the user
    loginUser,                              // To login the user
    logout,                                 // To logout the user
    updatePassword,                         // To reset the user's password    
    getUserDatails,                         // To view the user's own profile
    updateProfile,                          // To update the user's profile
    getAllUser,                             // To know the details of all users
    getUserAddtionalInformation,            // to total dposite amount, withdraw amount and buy ticket              
    getSingleUser,                          // To know the details of the user
    updateUserData,                         // Admin to update user
    deleteUser,                             // Admin to Delete user
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { currency } = require("../controller/updateCurrency");


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/api/user


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password-update").put(isAuthenticatedUser, updatePassword);

router.route("/profile").get(isAuthenticatedUser, getUserDatails);

router.route("/profile/update").put(isAuthenticatedUser, updateProfile);

router.route("/change-currency").post(isAuthenticatedUser, currency);

// -----------------------------------------------//
// ------------------ Admin side ---------------- //
// -----------------------------------------------//

// -->  http://localhost:8002/api/admin


router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router.route("/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserData)
    // .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


// router.route("/password/forgot").post(forgotPassword);

// router.route("/password/reset/:token").put(resetpassword);



module.exports = router;