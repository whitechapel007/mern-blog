import { Alert } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetErrorMessage,
  resetSuccessMessage,
} from "../app/features/userSlice";

function ErrorModal() {
  
  const { error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    let timer = setTimeout(() => {
      dispatch(resetErrorMessage());
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);
  return (
    error && (
      <Alert className="mt-5" color="failure">
        {error}
      </Alert>
    )
  );
}

export default ErrorModal;

export function SuccessModal() {
  const { success } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    let timer = setTimeout(() => {
      dispatch(resetSuccessMessage());
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [success]);

  return (
    success && (
      <Alert className="mt-5" color="success">
        {success}
      </Alert>
    )
  );
}
