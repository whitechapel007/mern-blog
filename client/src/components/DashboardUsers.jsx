import { useSelector, useDispatch } from "react-redux";
import useDecodeToken from "./useDecodeToken";
import { Table, Spinner } from "flowbite-react";
import { useState } from "react";
import { closeModal, openModal } from "../app/modal/modalSlice";
import {  successMessage } from "../app/features/userSlice";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../app/services/userApi";
import { FaCheck, FaTimes } from "react-icons/fa";
import ConfirmDeleteModal from "./modals/ConfimDeleteModal";
import PropTypes from "prop-types";

const DashboardUsers = () => {
  const [pages, setPages] = useState(0);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const isAdmin = useDecodeToken() || false;
  const dispatch = useDispatch();
  const { showModal } = useSelector((state) => state.modal);

  const { data, isLoading, refetch } = useGetUsersQuery(pages);
  const [deleteUser] = useDeleteUserMutation();

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
        // dispatch(logErrorMessage(error.data?.message));
      });
  };
  async function handleShowMore() {
    try {
      setPages(data?.users.length);
      refetch();
    } catch (error) {
      // dispatch(logErrorMessage(error.message));
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

const TableHead = () => (
  <Table.Head>
    <Table.HeadCell>Date Created</Table.HeadCell>
    <Table.HeadCell>User Image</Table.HeadCell>
    <Table.HeadCell>Username</Table.HeadCell>
    <Table.HeadCell>Email</Table.HeadCell>
    <Table.HeadCell>Admin</Table.HeadCell>
    <Table.HeadCell>Delete</Table.HeadCell>
  </Table.Head>
);

const UserRow = ({ user, onDelete }) => (
  <Table.Body className="divide-y">
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
      <Table.Cell>
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 object-cover bg-gray-500 rounded-full"
        />
      </Table.Cell>
      <Table.Cell>{user.username}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>
        {user.isAdmin ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaTimes className="text-red-500" />
        )}
      </Table.Cell>
      <Table.Cell>
        <button
          className="font-medium text-red-500 hover:underline cursor-pointer"
          onClick={onDelete}
        >
          Delete
        </button>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DashboardUsers;
