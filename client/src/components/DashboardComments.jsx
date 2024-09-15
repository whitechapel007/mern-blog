import { useSelector, useDispatch } from "react-redux";
import useDecodeToken from "./useDecodeToken";
import { Table, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { closeModal, openModal } from "../app/modal/modalSlice";
import { logErrorMessage, successMessage } from "../app/features/userSlice";
import {
  useDeleteCommentsMutation,
  useGetAllCommentsQuery,
} from "../app/services/commentApi";

import ConfirmDeleteModal from "./modals/ConfimDeleteModal";

import { TableCommentHead, UserRow } from "./TableCommentHead";

const DashboardComments = () => {
  const [pages, setPages] = useState(0);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const isAdmin = useDecodeToken() || false;
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.modal);

  const { data, isLoading, refetch } = useGetAllCommentsQuery(pages);
  const [deleteComments] = useDeleteCommentsMutation();

  useEffect(() => {
    refetch();
  }, []);

  const deleteComment = () => {
    deleteComments(commentIdToDelete)
      .unwrap()
      .then(() => {
        dispatch(successMessage("Comment deleted successfully"));
        refetch(); // Ensure refetch only after deletion is successful
        dispatch(closeModal());
      })
      .catch((error) => {
        console.error(error);
        dispatch(logErrorMessage(error.message));
      });
  };

  async function handleShowMore() {
    try {
      setPages(data?.users.length);
      refetch();
    } catch (error) {
      dispatch(logErrorMessage(error.message));
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      <Table hoverable className="shadow-md">
        <TableCommentHead />
        {isAdmin?.isAdmin && data?.comments?.length > 0
          ? data.comments.map((comment) => (
              <UserRow
                key={comment._id}
                comment={comment}
                onDelete={() => {
                  dispatch(openModal());
                  setCommentIdToDelete(comment._id);
                }}
              />
            ))
          : "No comments yet"}
      </Table>
      <ConfirmDeleteModal
        showModal={showModal}
        confirmText={"this user"}
        onClick={deleteComment}
      />

      <div className="text-center">
        {!(data?.comments.length < 10) && (
          <button className="w-full text-teal-500 " onClick={handleShowMore}>
            show more
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardComments;
