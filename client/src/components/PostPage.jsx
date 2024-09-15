import { Link, useParams } from "react-router-dom";

import {
  useGetPostsBySlugQuery,
  useGetPostsByLastThreeeQuery,
} from "../app/services/blogApi";
import { useDispatch } from "react-redux";
import { logErrorMessage } from "../app/features/userSlice";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const { isLoading, data, error } = useGetPostsBySlugQuery(postSlug);

  const { data: latestPosts } = useGetPostsByLastThreeeQuery();
  const dispatch = useDispatch();

  const eachPost = data?.posts[0];
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {" "}
        <Spinner />{" "}
      </div>
    );
  }

  if (error) {
    dispatch(logErrorMessage(error.message));
  }
  return (
    <main className="p-3 flex flex-col max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl ">
        {eachPost?.title}
      </h1>
      <Link
        to={`/search?category=${eachPost?.category}`}
        className="self-center mt-5"
      >
        <Button className="gray" pill size={"xs"}>
          {eachPost?.category}{" "}
        </Button>
      </Link>
      <img
        src={eachPost?.image}
        alt={eachPost?.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="flex justify-between p-3 border-b border-slate-400 text-xs">
        <span>{new Date(eachPost?.createdAt).toLocaleString()}</span>
        <span>{(eachPost?.content.length / 1000).toFixed(0)} mins read</span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: eachPost.content }}
      />

      <div className="max-w-4xl mx-auto w-full ">
        <CallToAction />
      </div>

      <CommentSection postId={eachPost._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-lg mt-5">Recent Articles</h1>

        <div className="flex flex-wrap w-full justify-center gap-5 mt-5">
          {latestPosts?.posts.map((each) => (
            <div key={each._id}>
              <PostCard post={each} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
