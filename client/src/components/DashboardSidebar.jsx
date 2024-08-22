import { Sidebar } from "flowbite-react";

import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logErrorMessage, signoutUser } from "../app/features/userSlice";
import useDecodeToken from "./useDecodeToken";

// eslint-disable-next-line react/prop-types
function DashboardSidebar({ tab }) {
  const { isAdmin } = useDecodeToken();

  const dispatch = useDispatch();

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
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Sidebar.Item
            active={tab === "profile"}
            href="/dashboard?tab=profile"
            icon={HiUser}
            label={isAdmin ? "Admin" : "User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>

          {isAdmin ? (
            <Sidebar.Item
              active={tab === "users"}
              href="/dashboard?tab=users"
              icon={HiUserGroup}
              label={"Users"}
              labelColor="dark"
            >
              Users
            </Sidebar.Item>
          ) : null}

          {isAdmin ? (
            <Sidebar.Item
              active={tab === "posts"}
              href="/dashboard?tab=posts"
              icon={HiDocumentText}
              label={"Posts"}
              labelColor="dark"
            >
              Posts
            </Sidebar.Item>
          ) : null}
          <Sidebar.Item
            href="/sign-in"
            className="cursor-pointer"
            icon={HiArrowSmRight}
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashboardSidebar;
