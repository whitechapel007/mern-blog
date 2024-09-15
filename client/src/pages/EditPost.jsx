import { Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

import ReactQuill from "react-quill";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

import { logErrorMessage, successMessage } from "../app/features/userSlice";

import { useDispatch } from "react-redux";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import ErrorModal from "../components/ErrorModal";
import { useParams } from "react-router-dom";
import { useGetPostsByIdQuery } from "../app/services/blogApi";

function EditPost() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    image: "",
  });

  const { data, error, isLoading, isFetching, refetch } =
    useGetPostsByIdQuery(postId);

  let eachPost = data?.posts[0];

  useEffect(() => {
    refetch();
    setFormData(eachPost);
  }, []);

  //submit

  if (isLoading || isFetching) {
    return <Spinner />;
  }

  if (error) {
    return dispatch(logErrorMessage(error.message));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/post/update-post/${eachPost._id}/${eachPost.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json().then(() => {
        refetch();
      });

      if (!res.ok) {
        dispatch(logErrorMessage(data.message));
        return;
      } else {
        dispatch(successMessage("edit successful"));
      }
    } catch (error) {
      dispatch(logErrorMessage(error.message));
    }
  }
  async function handleUploadImage() {
    try {
      if (!file) {
        dispatch(logErrorMessage("please select an image"));
        return;
      }
      const storage = getStorage(app);

      const fileName = new Date().getTime() + "_" + file.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          dispatch(logErrorMessage(error.message));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadUrl });
          });
        }
      );
    } catch (error) {
      dispatch(logErrorMessage(error.message));
      console.log(error);
      setImageUploadProgress(null);
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl  my-7 font-semibold ">
        updatde post{" "}
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between ">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData?.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData?.category}
          >
            <option value="uncategorized">Select a category </option>

            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-2 rounded-sm  p-2">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
          >
            {imageUploadProgress ? (
              <div className="w-6 h-6">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${
                    imageUploadProgress < 100 ? imageUploadProgress || 0 : null
                  }%`}
                />
              </div>
            ) : (
              "Upload image "
            )}
          </Button>
        </div>

        <ErrorModal />

        <img
          src={formData?.image}
          alt="upload blog img"
          className="w-full h-72 object-cover"
        />

        <ReactQuill
          theme="snow"
          placeholder="write something..."
          className="h-72  mb-12 "
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData?.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          update post
        </Button>
      </form>
    </div>
  );
}

export default EditPost;
