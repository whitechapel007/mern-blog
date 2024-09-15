import { Table } from "flowbite-react";
import { FaCheck, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

export const TableHead = () => (
  <Table.Head>
    <Table.HeadCell>Date Created</Table.HeadCell>
    <Table.HeadCell>User Image</Table.HeadCell>
    <Table.HeadCell>Username</Table.HeadCell>
    <Table.HeadCell>Email</Table.HeadCell>
    <Table.HeadCell>Admin</Table.HeadCell>
    <Table.HeadCell>Delete</Table.HeadCell>
  </Table.Head>
);

export const UserRow = ({ user, onDelete }) => (
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
