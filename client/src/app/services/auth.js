import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (formData) => ({
        url: "/signin",
        method: "POST",
        body: formData,
      }),
    }),
    signup: builder.mutation({
      query: (formData) => ({
        url: "/signup",
        method: "POST",
        body: formData,
      }),
    }),
    oauth: builder.mutation({
        query: (formData) => ({
          url: "/auth/google",
          method: "POST",
          body: formData,
        }),
      }),
  }),
});

export const { useSigninMutation, useSignupMutation,useOauthMutation } = authApi;
