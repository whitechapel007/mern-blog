import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  getToken,
} from "../app/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useOauthMutation } from "../app/services/auth";
export default function OAuth() {
  const auth = getAuth(app);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oauth] = useOauthMutation();

  async function handleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const { displayName, email, photoURL } = resultsFromGoogle.user;

      const formData = {
        name: displayName,
        email,
        googlePhotoUrl: photoURL,
      };

      const user = await oauth(formData).unwrap();
      console.log(user);

      dispatch(signInSuccess(user.rest));
      dispatch(getToken(user.token));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleSignIn}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with google
    </Button>
  );
}
