import { Button, Select, Spinner, TextInput } from "flowbite-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useGetPostsByQueriesQuery } from "../app/services/blogApi";
import { useState } from "react";
import PostCard from "../components/PostCard";

const Search = () => {
  const { search } = useLocation();

  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const searchTermFromUrl = params.get("searchTerm") || "";

  const sortTermFromUrl = params.get("sort") || "";

  const categoryTermFromUrl = params.get("category") || "";
  const [sidebarData, setSidebarData] = useState({
    searchTerm: searchTermFromUrl,
    sort: sortTermFromUrl,
    category: categoryTermFromUrl,
  });

  const { data, isFetching } = useGetPostsByQueriesQuery(params.toString());

  console.log(data.posts);
  function handleChange(e) {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      setSidebarData({ ...sidebarData, sort: e.target.value });
    }
    if (e.target.id === "category") {
      setSidebarData({ ...sidebarData, category: e.target.value });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    params.set("searchTerm", sidebarData.searchTerm);
    params.set("category", sidebarData.category);
    params.set("sort", sidebarData.sort);

    navigate(`/search?${params.toString()}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-200">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="" className=" whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              placeholder="search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold ">
              Sort
            </label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="asc">Latest</option>
              <option value="desc">Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold ">
              Category
            </label>
            <Select
              onChange={handleChange}
              id="category"
              value={sidebarData.category}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">Reactjs</option>
              <option value="nextjs">Nextjs</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>

          <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
            Search
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-200 p-3 mt-5">
          Post results:
        </h1>

        <div className="p-7 flex-wrap gap-4">
          {" "}
          {!isFetching && data.posts.length === 0 && (
            <p className="text-xl text-gray-400">No Posts Found </p>
          )}
          {isFetching && (
            <p className="text-xl text-gray-400">
              <Spinner />
            </p>
          )}
          {data?.posts?.map((eachPost, idx) => (
            <PostCard post={eachPost} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
