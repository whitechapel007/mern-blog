const express = require("express");

const authenticateUser = require("../utils/authenticateUser");
const {
  createPost,
  getPosts,
  deletePosts,
} = require("../controller/postController");

const router = express.Router();

router.route("/create-post").post(authenticateUser, createPost);

router.route("/get-posts").get(getPosts);
router
  .route("/delete-posts/:postId/:userId")
  .delete(authenticateUser, deletePosts);

module.exports = router;
