import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useLikeCommentsMutation,
  useDeleteCommentsMutation,
} from "../app/services/commentApi";

import PropTypes from "prop-types";
import Comment from "./Comment";
import { logErrorMessage } from "../app/features/userSlice";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [createComment] = useCreateCommentMutation();
  const [likeComments] = useLikeCommentsMutation();

  const [deleteComments] = useDeleteCommentsMutation();
  const [comment, setComment] = useState("");

  const { data, refetch } = useGetCommentsQuery(postId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    createComment({
      body: {
        content: comment,
        postId,
        userId: currentUser._id,
      },
    })
      .unwrap()
      .then(() => {
        setComment("");
        refetch();
      })
      .catch((err) => {
        dispatch(logErrorMessage(err.data.message));
      });
  }
  async function handleLike(commentId) {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    likeComments(commentId).then(() => {
      refetch();
    });
  }

  async function onDelete(commentId) {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    deleteComments(commentId).then(() => {
      refetch();
    });
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>signed in as :</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="w-5 h-5 object-cover rounded-full"
          />
          <Link
            to={`/dashboard/?tab=profile`}
            className="text-xs text-cyan-500 hover:underline "
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-400 my-5 flex gap-1 ">
          you must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment"
            rows={3}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone={"purpleToBlue"} type="submit">
              Submit{" "}
            </Button>
          </div>
        </form>
      )}

      {data?.length > 0 && (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>

            <div className="border border-gray-400 py-1 px-2 rounded-sm ">
              <p>{data.length}</p>
            </div>
          </div>

          {data.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              refetch={refetch}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

// Declare propTypes
CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
