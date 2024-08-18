const express = require("express");

const authenticateUser = require("../utils/authenticateUser");
const {
  createPost,
  getPosts,
  deletePosts,
  updatePost,
} = require("../controller/postController");

const router = express.Router();

router.route("/create-post").post(authenticateUser, createPost);

router.route("/get-posts").get(getPosts);
router
  .route("/delete-posts/:postId/:userId")
  .delete(authenticateUser, deletePosts);

router.route("/update-post/:postId/:userId").put(authenticateUser, updatePost);

module.exports = router;
