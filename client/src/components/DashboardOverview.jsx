import { useSelector } from "react-redux";
import { useGetAllCommentsQuery } from "../app/services/commentApi";
import { useGetUsersQuery } from "../app/services/userApi";
import { useGetBlogsByUserIdQuery } from "../app/services/blogApi";
import { useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const [pages] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const { data: blogsData } = useGetBlogsByUserIdQuery({
    currentUser: currentUser._id,
    startIndex: pages,
  });

  const { data: usersData } = useGetUsersQuery(pages);

  const { data: commentsData } = useGetAllCommentsQuery(pages);

  console.log(commentsData);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center ">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className=" ">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl ">{usersData?.totalUsers}</p>
            </div>
            <HiDocumentText className=" bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {usersData?.lastMonthUsers}
            </span>
            <div className="text-gray-500 ">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className=" ">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl ">{usersData?.posts}</p>
            </div>
            <HiOutlineUserGroup className=" bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {usersData?.lastMonthUsers}
            </span>
            <div className="text-gray-500 ">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className=" ">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl ">{usersData?.comments}</p>
            </div>
            <HiAnnotation className=" bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {usersData?.lastMonthUsers}
            </span>
            <div className="text-gray-500 ">Last Month</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center ">
        <div className="flex flex-col w-full md:w-auto  shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button as={Link} to={"/dashboard?tab=users"}>
              see all
            </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username </Table.HeadCell>
            </Table.Head>

            {usersData?.users?.map((user) => {
              return (
                <Table.Body key={user?._id} className=" divide-y ">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user?.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto  shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button as={Link} to={"/dashboard?tab=comments"}>
              see all
            </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>likes </Table.HeadCell>
            </Table.Head>

            {commentsData?.comments?.map((comment) => {
              return (
                <Table.Body key={comment?._id} className=" divide-y ">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="line-clamp-2 w-96 ">
                      {comment?.content}
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto  shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button as={Link} to={"/dashboard?tab=posts"}>
              see all
            </Button>
          </div>

          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title </Table.HeadCell>
              <Table.HeadCell>Category </Table.HeadCell>
            </Table.Head>

            {blogsData?.blogs?.map((blog) => {
              return (
                <Table.Body key={blog?._id} className=" divide-y ">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={blog?.image}
                        alt="blog"
                        className="w-14  h-10 bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{blog?.title}</Table.Cell>
                    <Table.Cell className="w-5">{blog?.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
