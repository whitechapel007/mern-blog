// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/post" }),
  endpoints: (builder) => ({
    getBlogsByUserId: builder.query({
      query: ({ currentUser, startIndex }) => {
        return `/get-posts?userId=${currentUser}&startIndex=${startIndex}`;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBlogsByUserIdQuery } = blogsApi;
