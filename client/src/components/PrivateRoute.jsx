import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import useDecodeToken from "../components/useDecodeToken";
// eslint-disable-next-line react/prop-types
function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser } = useSelector((state) => state.user);
  const { isAdmin } = useDecodeToken();

  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/sign-in" />;
  }
  return children;
}

export default PrivateRoute;
