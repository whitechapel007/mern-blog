const express = require("express");

const authenticateUser = require("../utils/authenticateUser");

const {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments
} = require("../controller/commentController");

const router = express.Router();

router.route("/create").post(authenticateUser, createComment);

router.route("/getPostComments/:postId").get(getPostComments);

router.route("/likeComment/:commentId").put(authenticateUser, likeComment);

router.route("/editComment/:commentId").put(authenticateUser, editComment);

router.route("/deleteComment/:commentId").delete(authenticateUser, deleteComment);

router.route("/getComments").get(authenticateUser, getComments);

module.exports = router;
