import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

import { useDispatch, useSelector } from "react-redux";
import {
  logErrorMessage,
  successMessage,
  signUp,
} from "../app/features/userSlice";

function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});

  const { loading: isLoading } = useSelector((state) => state.user);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      dispatch(logErrorMessage("please fill out all the fields"));
      return;
    }
    try {
      const data = await dispatch(signUp(formData));
      console.log(data);
      if (data.payload.success) {
        dispatch(successMessage(data.payload.message));
      }
    } catch (error) {
      dispatch(logErrorMessage(error.message));
    }
  }
  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-xl w-full mx-auto">
        <form className="flex flex-col gap-5 px-5" onSubmit={handleSubmit}>
          <div className="shadow-lg">
            <Label value="your username" />
            <TextInput
              type="text"
              placeholder="Username"
              onChange={handleChange}
              name="username"
            />
          </div>
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
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "Sign Up"}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-5 px-5">
          <span>have an account ?</span>
          <Link to="/sign-in" className="text-blue-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
