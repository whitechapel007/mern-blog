import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useGetAllBlogPostsQuery } from "../app/services/blogApi";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";

function Home() {
  const { data } = useGetAllBlogPostsQuery();
  console.log(data);
  return (
    <div>
      <div className="flex flex-col gap-6 p-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">welcome to my blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium
          quo ducimus error consequatur officia aperiam minus incidunt culpa
          accusamus obcaecati dolorum, provident, deserunt rerum. Quae ea quas
          culpa dignissimos laudantium!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div
        className="max-w-6xl mx-auto p-3  
      flex flex-col  gap-8 py-6"
      >
        <p className="text-center text-3xl font-semibold">Recent Posts</p>
        <div className="flex flex-wrap gap-6 justify-center">
          {data?.posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      <div className=" text-center flex justify-center pb-4">
        <Button
          as={Link}
          to={"/search"}
          className="text-lg text-white hover:underline text-center"
        >
          View All Posts
        </Button>
      </div>
    </div>
  );
}

export default Home;
