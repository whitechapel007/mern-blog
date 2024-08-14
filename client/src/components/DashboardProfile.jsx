import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  signInFailure,
  successMessage,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logErrorMessage,
  signoutUser,
} from "../app/features/userSlice";
import ErrorModal, { SuccessModal } from "./ErrorModal";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { closeModal, openModal } from "../app/modal/modalSlice";

import useDecodeToken from "../components/useDecodeToken";
import ConfimDeleteModal from "./modals/ConfimDeleteModal";

function DashboardProfile() {
  const navigate = useNavigate();

  const { isAdmin } = useDecodeToken();
  const filePickerRef = useRef();
  const { currentUser, loading } = useSelector((state) => state.user);
  const { showModal } = useSelector((state) => state.modal);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const dispatch = useDispatch();

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }
  async function uploadImage() {
    setImageFileUploading(true);
    const storage = getStorage(app);

    const filename = new Date().getTime() + image.name;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (err) => {
        dispatch(
          signInFailure(err.message || "image upload failed: large file ")
        );
        setImageUploadProgress(null);
        setImage(null);
        setImageUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  }

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      return;
    }

    if (imageFileUploading) {
      return;
    }
    try {
      dispatch(updateStart());

      const response = await fetch(`/api/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        dispatch(successMessage("user successfully updated"));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  async function handleUserDelete() {
    dispatch(closeModal());
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
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

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">profile </h1>{" "}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="images/*"
          onChange={handleImage}
          ref={filePickerRef}
          hidden
        />
        <button
          className="w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full relative"
          onClick={() => filePickerRef.current.click()}
          type="button"
        >
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={
                imageUploadProgress < 100 ? `${imageUploadProgress}%` : null
              }
              strokeWidth={3}
              styles={{
                root: {
                  width: "100%",
                  height: "100% ",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  color: `rgba(62,152,199,${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
              imageUploadProgress && imageUploadProgress < 100
                ? "opacity-60"
                : "opacity-1"
            }`}
          />
        </button>

        <ErrorModal />
        <SuccessModal />
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone={"purpleToPink"}
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? <CircularProgressbar /> : "Update"}
        </Button>

        {currentUser && isAdmin && (
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            className="w-full"
            onClick={() => navigate("/dashboard/create-post")}
          >
            Create a Post
          </Button>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <button
          className="cursor-pointer"
          onClick={() => dispatch(openModal())}
        >
          Delete Account
        </button>
        <button className="cursor-pointer" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
      <ConfimDeleteModal
        confirmText={"this user"}
        onClick={handleUserDelete}
        showModal={showModal}
      />
    </div>
  );
}

export default DashboardProfile;
