import { useState, useContext, useEffect } from "react";
import useClick from "@react-hook/click";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import Skeleton from "react-loading-skeleton";
import "./actions.css";

const Image = ({
  caption,
  likes,
  totalLikes,
  setLikes,
  likedPhoto,
  docId,
  src,
  toggleLiked,
  setToggleLiked,
}) => {
  const { app, FieldValue } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);

  const [hasLikedPhoto, setHasLikedPhoto] = useState(likedPhoto);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (likes?.includes(user.uid)) {
      setHasLikedPhoto(true);
    } else {
      setHasLikedPhoto(false);
    }
  }, [likes, user.uid]);

  const handleDoubleClick = useClick("double", async () => {
    setShowAnimation(false);
    if (likes?.includes(user.uid)) {
      setHasLikedPhoto(true);
    } else {
      setHasLikedPhoto(false);
    }

    if (!hasLikedPhoto) {
      await app
        .firestore()
        .collection("photos")
        .doc(docId)
        .update({
          likes: FieldValue.arrayUnion(user.uid),
        });
    }
    if (!toggleLiked) {
      setLikes((likes) => likes + 1);

      setToggleLiked(true);
    }

    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
  });

  return (
    <div className="post__img flex justify-center items-center">
      {!src ? (
        <Skeleton count={1} width={675} height={845} />
      ) : (
        <>
          <img onClick={handleDoubleClick} src={src} alt={caption} />
          {showAnimation && (
            <svg
              className="text-red-500 absolute w-24 animate-ping-long"
              xmlns="http://www.w3.org/2000/svg"
              fill="#ef4444"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </>
      )}
    </div>
  );
};

export default Image;
