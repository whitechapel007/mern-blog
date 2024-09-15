import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import useDecodeToken from "../components/useDecodeToken";
import { PropTypes } from "prop-types";

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

// Declare propTypes
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is a valid React node and required
  adminOnly: PropTypes.bool, // adminOnly is a boolean
};
