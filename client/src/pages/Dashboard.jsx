import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardProfile from "../components/DashboardProfile";
import DashboardPosts from "../components/DashboardPosts";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlTab = urlParams.get("tab");
    setTab(urlTab);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashboardSidebar tab={tab} />
      </div>
      {tab === "profile" ? <DashboardProfile /> : null}
      {tab === "posts" ? <DashboardPosts /> : null}
    </div>
  );
}

export default Dashboard;
