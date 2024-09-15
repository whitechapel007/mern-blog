import { Table } from "flowbite-react";
import PropTypes from "prop-types";

export const TableCommentHead = () => (
  <Table.Head>
    <Table.HeadCell>Date Updated</Table.HeadCell>
    <Table.HeadCell>Comment Content</Table.HeadCell>
    <Table.HeadCell>No of Likes</Table.HeadCell>
    <Table.HeadCell>PostId</Table.HeadCell>
    <Table.HeadCell>UserId</Table.HeadCell>
    <Table.HeadCell>Delete</Table.HeadCell>
  </Table.Head>
);

export const UserRow = ({ comment, onDelete }) => {
  return (
    <Table.Body className="divide-y">
      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell>
          {new Date(comment?.updatedAt).toLocaleDateString()}
        </Table.Cell>
        <Table.Cell>{comment?.content}</Table.Cell>
        <Table.Cell>{comment?.numberOfLikes}</Table.Cell>
        <Table.Cell>{comment?.postId}</Table.Cell>
        <Table.Cell>{comment?.userId}</Table.Cell>
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
};

UserRow.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    content: PropTypes.string,
    numberOfLikes: PropTypes.number.isRequired,
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
