const express = require("express");

const router = express.Router();
const {
  signup,
  signin,
  signinWithGoogle,
  updateUser,
  deleteUser,
  signOutUser,
  getUsers,
  getIndividualUser
} = require("../controller/userController");
const authenticateUser = require("../utils/authenticateUser");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/auth/google").post(signinWithGoogle);
router.route("/update/:userId").put(authenticateUser, updateUser);
router.route("/delete/:userId").delete(authenticateUser, deleteUser);
router.route("/sign-out").post(signOutUser);

router.route("/getUsers").get(authenticateUser, getUsers);

router.route("/:userId").get(authenticateUser, getIndividualUser);

module.exports = router;
