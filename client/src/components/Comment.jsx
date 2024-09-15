import { useGetEachUserQuery } from "../app/services/userApi";
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { useEditCommentsMutation } from "../app/services/commentApi";
import { useDispatch, useSelector } from "react-redux";
import { logErrorMessage, successMessage } from "../app/features/userSlice";
import ConfimDeleteModal from "./modals/ConfimDeleteModal";
import { closeModal, openModal } from "../app/modal/modalSlice";

const Comment = ({ comment, onLike, refetch, onDelete }) => {
  const { showModal } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const { data } = useGetEachUserQuery(comment.userId);

  const [isEditing, setIsEditing] = useState(false);

  const [editComment] = useEditCommentsMutation();

  const handleEdit = () => {
    setIsEditing(true);
  };
  const [editContent, setEditContent] = useState(comment?.content);

  const handleSave = async () => {
    editComment({
      commentId: comment._id,
      content: editContent,
    })
      .unwrap()
      .then(() => {
        dispatch(successMessage("comment edited successfully"));

        setIsEditing(false);
        refetch();
      })
      .catch((e) => {
        dispatch(logErrorMessage(e.message));
      });
  };

  const deleteComment = async () => {
    onDelete(comment?._id).then(() => {
      dispatch(successMessage("comment deleted successfully"));

      dispatch(closeModal());
    });
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3 ">
        <img
          src={data?.profilePicture}
          alt={data?.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {data ? `@${data.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(data?.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none dark:bg-slate-600  focus:bg-gray-100 dark:focus:bg-gray-800"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            ></Textarea>

            <div className="flex justify-end gap-2 text-xs mt-1">
              <Button
                type="button"
                size="sm"
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
              >
                {" "}
                save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={() => setIsEditing(false)}
              >
                {" "}
                cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-300 mb-2">
              {comment.content}
            </p>
            <div className="flex items-center pt-2 text-xs max-w-fit  gap-2">
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  data &&
                  comment.likes.includes(comment.userId) &&
                  "!text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {(data?.isAdmin || comment?.userId === data?._id) && (
                <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => handleEdit()}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => dispatch(openModal())}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <ConfimDeleteModal
        showModal={showModal}
        confirmText={"this post"}
        onClick={deleteComment}
      />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  onLike: PropTypes.func,
  refetch: PropTypes.func,
  onDelete: PropTypes.func,
};
export default Comment;
