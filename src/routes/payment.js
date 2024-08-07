const express = require("express");

const { deposit, withdraw, getWithdraws, getRequestWithdraws, getDeposits, getRequestDeposits, setRejectDeposit, setRejectwithdraw, setApprovewithdraw, setApproveDeposit, depositsHistory, withdrawHistory } = require("../controller/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { paymentvalidStatus } = require("../middleware/paymentStatus");
const router = express.Router();



// -------  user Routes ------- //
// -->  http://localhost:8002/thailottery/api/payment
router.route("/user/deposit").post(isAuthenticatedUser, deposit);
router.route("/user/withdraw").post(isAuthenticatedUser, withdraw);

router.route("/user/deposite/history").get(isAuthenticatedUser, depositsHistory);
router.route("/user/withdraw/history").get(isAuthenticatedUser, withdrawHistory);



// -------  admin Routes ------- //

router.route("/withdraws").get(isAuthenticatedUser, authorizeRoles("admin"), getWithdraws);
router.route("/withdraws/:status").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestWithdraws);

router.route("/deposites").get(isAuthenticatedUser, authorizeRoles("admin"), getDeposits);
router.route("/deposites/:status").get(isAuthenticatedUser, authorizeRoles("admin"), paymentvalidStatus, getRequestDeposits);

router.route("/deposite/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApproveDeposit);
router.route("/deposite/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectDeposit);

router.route("/withdraw/approve/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setApprovewithdraw);
router.route("/withdraw/reject/:id").get(isAuthenticatedUser, authorizeRoles("admin"), setRejectwithdraw);

module.exports = router;