import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logErrorMessage } from "../app/features/userSlice";

const useDecodeToken = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Initialize the return object
  let decodedInfo = { isAdmin: false };

  if (!token) {
    navigate("/sign-up");
    return decodedInfo; // Return even when navigating
  }

  try {
    const decoded = jwtDecode(token);

    decodedInfo.isAdmin = decoded?.isAdmin || false;
  } catch (error) {
    console.log(error);
    dispatch(logErrorMessage(error.message));
    navigate("/sign-up");
  }

  return decodedInfo; // Always return the object
};

export default useDecodeToken;
