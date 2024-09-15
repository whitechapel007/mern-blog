import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInSuccess,
  getToken,
  logErrorMessage,
} from "../app/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { useSigninMutation } from "../app/services/auth";
function SignIn() {
  const [signin] = useSigninMutation();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.user);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.password || !formData.email) {
      dispatch(signInFailure("please fill out all the fields"));
      return;
    }
    try {

      const user = await signin(formData);
      if (user.data) {
        dispatch(signInSuccess(user.data.rest));
        dispatch(getToken(user.data.token));
        navigate("/");
      } else {
        dispatch(logErrorMessage(user.error.data.message));
      }
    } catch (error) {
      console.log(error, "error");
      dispatch(logErrorMessage(error.message));
    }
  }
  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-xl w-full mx-auto">
        <form className="flex flex-col gap-5 px-5" onSubmit={handleSubmit}>
          <div className="shadow-lg">
            <Label value="your email" />
            <TextInput
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="shadow-lg">
            <Label value="your password" />
            <TextInput
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Sign In"}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-5 px-5">
          <span>Dont have an account ?</span>
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </div>
        <div className="px-5"></div>
      </div>
    </div>
  );
}

export default SignIn;
