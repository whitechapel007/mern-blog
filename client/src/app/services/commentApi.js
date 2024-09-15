// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/comment" }),
  tagTypes: ["comments"],
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ body }) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),
    getComments: builder.query({
      query: (postId) => `/getPostComments/${postId}`,
    }),
    getAllComments: builder.query({
      query: (startIndex) => `/getComments?startIndex=${startIndex}`,
    }),
    likeComments: builder.mutation({
      query: (commentId) => ({
        url: `likeComment/${commentId}`,
        method: "PUT",
      }),
    }),
    deleteComments: builder.mutation({
      query: (commentId) => ({
        url: `deleteComment/${commentId}`,
        method: "DELETE",
      }),
    }),

    editComments: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `editComment/${commentId}`,
        method: "PUT",
        body: { content },
      }),
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsQuery,
  useLikeCommentsMutation,
  useEditCommentsMutation,
  useDeleteCommentsMutation,
  useGetAllCommentsQuery
} = commentsApi;
