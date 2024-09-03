const express = require("express");
const router = express.Router();
const userService = require("../services/render");
const { registerUser,                       // To register the user
    loginUser,                              // To login the user
    logout,                                 // To logout the user
    getUserDatails,                         // To view the user's own profile
    updatePassword,                         // To reset the user's password    
    updateProfile,                          // To update the user's profile
    getAllUser,                             // To know the details of all users
    getUserAddtionalInformation,            // to total dposite amount, withdraw amount and buy ticket              
    getSingleUser,                          // To know the details of the user
    updateUserData,                         // Admin to update user
    deleteUser,                             // Admin to Delete user
    forgotPassword,                         // To make the user forget the password
    resetpassword,                          // To reset the user after forgetting his password
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { currency } = require("../controller/updateCurrency");


// fortend Routes
router.get('/user', userService.userRoutes)
router.get('/user-details/:id', userService.userDetails)


// -----------------------------------------------//
// ------------------ User side ----------------- // 
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api


router.route("/user/register").post(registerUser);                                                   // OK

router.route("/user/login").post(loginUser);                                                         // OK

router.route("/user/logout").get(logout);                                                            // OK

router.route("/user/password/update").put(isAuthenticatedUser, updatePassword);                      // OK

router.route("/user/profile").get(isAuthenticatedUser, getUserDatails);                              // OK

router.route("/user/profile/update").put(isAuthenticatedUser, updateProfile);                        // OK

router.route("/user/change-currency").post(isAuthenticatedUser, currency);                            // OK

// -----------------------------------------------//
// ------------------ Admin side ---------------- //
// -----------------------------------------------//

// -->  http://localhost:8002/thailottery/api


// router.route("/admin/users").get(getAllUser);           // OK
router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);           // OK

// router.route("/admin/user/:id").get(getUserAddtionalInformation);
// router.route("/admin/user/:id").get(getSingleUser);

router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserAddtionalInformation);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserData);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// router.route("/password/forgot").post(forgotPassword);

// router.route("/password/reset/:token").put(resetpassword);



module.exports = router;