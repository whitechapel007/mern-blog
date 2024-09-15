import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import ErrorModal, { SuccessModal } from "./components/ErrorModal";
import EditPost from "./pages/EditPost";
import PostPage from "./components/PostPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenExpiration } from "./app/services/api";
import { useNavigate } from "react-router-dom";
import { logErrorMessage, signoutUser } from "./app/features/userSlice";
import Search from "./pages/Search";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token && checkTokenExpiration(token)) {
      dispatch(logErrorMessage("Session expired. Please log in again."));
      dispatch(signoutUser());
      // Clear the token
      navigate("/sign-in"); // Redirect to login
    }
  }, [dispatch]);
  return (
    <div className="relative">
      <Header />
      <div className="md:w-[500px] mx-auto fixed right-1 top-0">
        <SuccessModal />
      </div>
      <div className="md:w-[500px] mx-auto fixed right-1 top-0">
        <ErrorModal />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/create-post"
          element={
            <PrivateRoute adminOnly>
              <CreatePost />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/update-post/:postId"
          element={
            <PrivateRoute adminOnly>
              <EditPost />
            </PrivateRoute>
          }
        />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
