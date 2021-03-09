import { useEffect, useContext, useState, useRef } from "react";
import Modal from "react-modal";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import {
  getPostByUsernameImageSrc,
  getUserPhotosByUserId,
} from "../../services/firebase";
import Actions from "../post/actions";
import Comments from "../post/comments";

const PostModal = ({ isModalOpen, setIsModalOpen, userId, postIndex }) => {
  const { storage } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);

  const [url, setUrl] = useState("");
  const [src, setSrc] = useState("");
  const [post, setPost] = useState({});
  const [photos, setPhotos] = useState([]);

  const imageRef = useRef();

  const commentInput = useRef(null);

  const handleFocus = () => commentInput.current.focus();

  const [hasUserLikedPhoto, setHasUserLikedPhoto] = useState(false);

  const [toggleLiked, setToggleLiked] = useState(hasUserLikedPhoto);
  const [likes, setLikes] = useState(0);

  Modal.setAppElement("#root");
  useEffect(() => {
    const getPhotoSrc = async () => {
      let photos = await getUserPhotosByUserId(userId);
      photos = [...photos].sort((a, b) => {
        return b.photoId - a.photoId;
      });
      setUrl(photos[postIndex].imageSrc);
      setLikes(photos[postIndex].likes.length);
      if (photos[postIndex].likes.includes(user.uid)) {
        setHasUserLikedPhoto(true);
      }
    };

    getPhotoSrc();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postIndex, userId]);

  useEffect(() => {
    const getPhoto = async () => {
      try {
        const path = await storage.ref(`${url}`).getDownloadURL();
        setSrc(path);
      } catch (error) {}
    };
    getPhoto();

    const getPost = async () => {
      const [post] = await getPostByUsernameImageSrc(userId, url);
      setPost(post);
    };
    getPost();
  }, [url, storage, userId]);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(200, 204, 198, 0.6)",
      zIndex: 11,
    },
    content: {
      zIndex: 12,
      maxWidth: 1400,
      maxHeight:
        imageRef.current && imageRef.current.height
          ? imageRef.current?.height
          : 600,
      position: "absolute",
      margin: "auto",
      padding: 0,
      overflow: "hidden",
    },
  };
  return (
    <div className="flex justify-center items-center ">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
      >
        <div className="flex">
          <div className="flex-1 h-full object-cover">
            <img
              ref={imageRef}
              src={src}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center mt-20 ">
            {post && post.comments && (
              <div className="">
                <Actions
                  docId={post.docId}
                  likes={post.likes}
                  totalLikes={likes}
                  setLikes={setLikes}
                  likedPhoto={hasUserLikedPhoto}
                  handleFocus={handleFocus}
                  toggleLiked={toggleLiked}
                  setToggleLiked={setToggleLiked}
                />
                <Comments
                  docId={post.docId}
                  comments={post.comments}
                  posted={post.dateCreated}
                  commentInput={commentInput}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostModal;
