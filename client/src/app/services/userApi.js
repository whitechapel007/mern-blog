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
      providesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: "DELETE",
        providesTags: ["user"],
      }),
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
