import { useContext, useState } from "react";
import FirebaseContext from "../context/firebase";
import UserContext from "../context/user";
import { createPost, getUserPhotosByUserId } from "../services/firebase";
import Header from "../components/Header";

const UploadPost = () => {
  const { storage } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    let photos = await getUserPhotosByUserId(user.uid);
    photos = [...photos].sort((a, b) => {
      return a.photoId - b.photoId;
    });
    const newPhotoId = photos[photos.length - 1].photoId + 1;
    createPost(user.uid, newPhotoId, caption);
    const uploadTask = storage
      .ref(`images/users/${user.displayName}/${newPhotoId}.jpg`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref(`images/users/${user.displayName}/${newPhotoId}.jpg`)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center flex-col">
        <progress value={progress} max="100" />
        <input className="ml-32 my-5" type="file" onChange={handleChange} />
        <div className="flex justify-center items-center">
          <textarea
            className="border-2 border-black"
            name="caption"
            value={caption}
            placeholder="Enter a caption"
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
          <button
            className="px-6 py-3 bg-black ml-4 text-white"
            type="button"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
        <img src={url || "http://via.placeholder.com/300"} alt="firebase" />
      </div>
    </>
  );
};

export default UploadPost;
