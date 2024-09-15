const Comment = require("../model/commentModel");

const errorHandler = require("../utils/error");

async function createComment(req, res, next) {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "you are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
}

async function getPostComments(req, res, next) {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      creaedAt: -1,
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
}

async function likeComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

async function editComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "comment not found"));
    }

    if (comment.userId !== req.user.id || !req.user.isAdmin) {
      return next(
        errorHandler(403, "you are not allowed to edit this comment")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const isAuthorized = comment.userId === req.user.id || req.user.isAdmin;
    if (!isAuthorized) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }

    await comment.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getComments(req, res, next) {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "you are not allowed to view this resource"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;

    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ creaedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
};
