const express = require("express");
const { registerUser,                       // To register the user
    loginUser,                              // To login the user
    logout,                                 // To logout the user
    forgotPassword,                         // To make the user forget the password
    resetpassword,                          // To reset the user after forgetting his password
    getUserDatails,                         // To view the user's own profile
    updatePassword,                         // To reset the user's password    
    updateProfile,                          // To update the user's profile
    getAllUser,                             // To know the details of all users
    getSingleUser,                          // To know the details of the user
    updateUserRole,                         // Admin to update user
    deleteUser,                              // Admin to Delete user
    dashboard,
} = require("../controller/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/profile/update").put(isAuthenticatedUser, updateProfile);

router.route("/profile").get(isAuthenticatedUser, getUserDatails);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


// router.route("/password/forgot").post(forgotPassword);

// router.route("/password/reset/:token").put(resetpassword);



module.exports = router;