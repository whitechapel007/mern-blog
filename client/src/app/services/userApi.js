import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (startIndex) => `/getUsers?startIndex=${startIndex}`,
    }),
    getEachUser: builder.query({
      query: (userId) => `/${userId}`,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation, useGetEachUserQuery } =
  userApi;
