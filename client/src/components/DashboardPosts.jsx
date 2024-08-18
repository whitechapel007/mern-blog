import { useSelector, useDispatch } from "react-redux";

import { useGetBlogsByUserIdQuery } from "../app/services/blogApi";

import useDecodeToken from "./useDecodeToken";
import { Table, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfimDeleteModal from "./modals/ConfimDeleteModal";
import { closeModal, openModal } from "../app/modal/modalSlice";
import { useDeletePostsMutation } from "../app/services/blogApi";
import { logErrorMessage, successMessage } from "../app/features/userSlice";

const DashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [pages, setPages] = useState(0);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const isAdmin = useDecodeToken() || false;
  const dispatch = useDispatch();

  console.log(postIdToDelete);
  const { data, isLoading, refetch } = useGetBlogsByUserIdQuery({
    currentUser: currentUser._id,
    startIndex: pages,
  });
  const { showModal } = useSelector((state) => state.modal);

  const [deletePosts] = useDeletePostsMutation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!data?.posts) {
    return new Error("no posts Posts");
  }

  async function handleShowMore() {
    try {
      setPages(data?.posts.length);
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePost() {
    try {
      deletePosts({ postId: postIdToDelete, userId: currentUser._id });
      refetch();

      dispatch(successMessage("post deleted successfully"));

      dispatch(closeModal());
    } catch (error) {
      dispatch(logErrorMessage(error.message));
    }
  }
  return (
    <div className="table-auto overflow-x-scroll  md:mx-auto  p-3">
      {isAdmin?.isAdmin && data?.posts?.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post image </Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>edit</span>{" "}
            </Table.HeadCell>
          </Table.Head>
          {data?.posts.map((post) => (
            <Table.Body key={post._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover  bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/post${post.slug}`}
                    className="font-medium text-gray-900  dark:text-white"
                  >
                    {post.title}
                  </Link>
                </Table.Cell>

                <Table.Cell>{post.category}</Table.Cell>

                <Table.Cell>
                  <button
                    className="font-medium text-red-500  hover:underline cursor-pointer"
                    onClick={() => {
                      dispatch(openModal());
                      setPostIdToDelete(post._id);
                    }}
                  >
                    Delete{" "}
                  </button>
                </Table.Cell>

                <Table.Cell>
                  <Link
                    to={`/dashboard/update-post/${post._id}`}
                    className="text-teal-500 hover:underline"
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>you have no posts yet</p>
      )}

      <div className="text-center">
        {!(data?.posts.length < 10) && (
          <button className="w-full text-teal-500 " onClick={handleShowMore}>
            show more
          </button>
        )}
      </div>

      <ConfimDeleteModal
        showModal={showModal}
        confirmText={"this post"}
        onClick={deletePost}
      />
    </div>
  );
};

export default DashboardPosts;
