import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import themeReducer from "./theme/themeSlice";

import modalReducer from "./modal/modalSlice";

import { blogsApi } from "./services/blogApi";
import { authApi } from "./services/auth";
import { userApi } from "./services/userApi";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { commentsApi } from "./services/commentApi";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  modal: modalReducer,
  [blogsApi.reducerPath]: blogsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(blogsApi.middleware)
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(commentsApi.middleware),
});

export const persistor = persistStore(store);
