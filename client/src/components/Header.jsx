import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../app/theme/themeSlice";
import { logErrorMessage, signoutUser } from "../app/features/userSlice";
import { useState } from "react";

function Header() {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const params = new URLSearchParams(search);

  const searchTerm = params.get("searchTerm");
  console.log(searchTerm);

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  function switchTheme() {
    dispatch(toggleTheme());
  }

  async function handleSignOut() {
    try {
      const res = await fetch("/api/sign-out", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(logErrorMessage(data.message));
      } else {
        dispatch(signoutUser());
      }
    } catch (error) {
      dispatch(logErrorMessage(error.message));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    params.set("searchTerm", searchValue);
    navigate(`/search?${params.toString()}`);
  }
  return (
    <Navbar fluid rounded>
      <Navbar.Brand
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold cursor-pointer dark:text-white"
        onClick={() => navigate("/")}
      >
        <span className="px-2 py-1 bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 rounded-lg text-white">
          {" "}
          Ebuka{" "}
        </span>{" "}
        blog
      </Navbar.Brand>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <TextInput
            type="text"
            placeholder="search..."
            className="hidden lg:inline"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <button type="submit">
            <AiOutlineSearch className="absolute top-3 right-2" />
          </button>
        </div>
      </form>
      <Button className="w-12 h-10 lg:hidden" color={"gray"} pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2 items-center">
        <Button
          className="w-12 h-10 hidden   sm:flex justify-center"
          color={"gray"}
          pill
          onClick={switchTheme}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={
                  currentUser.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />

            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => navigate("/sign-in")}>Sign In </Button>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active={pathname == "/"}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/about" active={pathname == "/about"}>
          About
        </Navbar.Link>
        <Navbar.Link href="/projects" active={pathname == "/projects"}>
          Projects
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
