import { useSelector, useDispatch } from "react-redux";
import useDecodeToken from "./useDecodeToken";
import { Table, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { closeModal, openModal } from "../app/modal/modalSlice";
import { logErrorMessage, successMessage } from "../app/features/userSlice";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../app/services/userApi";

import ConfirmDeleteModal from "./modals/ConfimDeleteModal";

import { TableHead, UserRow } from "./TableHead";

const DashboardUsers = () => {
  const [pages, setPages] = useState(0);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const isAdmin = useDecodeToken() || false;
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.modal);

  const { data, isLoading, refetch } = useGetUsersQuery(pages);
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    refetch();
  }, []);
  const deleteUsers = () => {
    deleteUser(userIdToDelete)
      .unwrap()
      .then(() => {
        dispatch(successMessage("User deleted successfully"));
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
        <TableHead />
        {isAdmin?.isAdmin && data?.users?.length > 0 ? (
          data.users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              onDelete={() => {
                dispatch(openModal());
                setUserIdToDelete(user._id);
              }}
            />
          ))
        ) : (
          <p>No users available</p>
        )}
      </Table>
      <ConfirmDeleteModal
        showModal={showModal}
        confirmText={"this user"}
        onClick={deleteUsers}
      />

      <div className="text-center">
        {!(data?.users.length < 10) && (
          <button className="w-full text-teal-500 " onClick={handleShowMore}>
            show more
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
