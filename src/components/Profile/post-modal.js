import { useEffect, useContext, useState, useRef } from "react";
import Modal from "react-modal";
import FirebaseContext from "../../context/firebase";
import {
  getPostByUsernameImageSrc,
  getUserPhotosByUserId,
} from "../../services/firebase";
import Actions from "../post/actions";
import Comments from "../post/comments";

const PostModal = ({
  isModalOpen,
  setIsModalOpen,
  userId,
  postIndex,
  username,
}) => {
  const { storage } = useContext(FirebaseContext);
  const [url, setUrl] = useState("");
  const [src, setSrc] = useState("");
  const [post, setPost] = useState({});

  const commentInput = useRef(null);

  const handleFocus = () => commentInput.current.focus();

  Modal.setAppElement("#root");
  useEffect(() => {
    const getPhotoSrc = async () => {
      let photos = await getUserPhotosByUserId(userId);
      photos = [...photos].sort((a, b) => {
        return b.photoId - a.photoId;
      });
      setUrl(photos[postIndex].imageSrc);
    };

    getPhotoSrc();
  }, [postIndex, userId]);

  useEffect(() => {
    const getPhoto = async () => {
      const path = await storage.ref(`${url}`).getDownloadURL();
      setSrc(path);
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
      width: 815,
      height: 600,
      position: "absolute",
      margin: "auto",
      padding: 0,
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
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-center mt-20 ">
            {post && post.comments && (
              <div className="">
                <Actions
                  docId={post.docId}
                  totalLikes={post.likes.length}
                  likedPhoto={post.userLikedPhoto}
                  handleFocus={handleFocus}
                />
                <Comments
                  docId={post.docId}
                  comments={post.comments}
                  posted={post.dateCreated}
                  commentInput={commentInput}
                  onProfile={true}
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
