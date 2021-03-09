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

  useEffect(() => {
    if (likes?.includes(user.uid)) {
      setHasLikedPhoto(true);
    } else {
      setHasLikedPhoto(false);
    }
  }, [likes, user.uid]);

  const handleDoubleClick = useClick("double", async () => {
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

  });

  return (
    <div className="post__img flex justify-center">
      {!src ? (
        <Skeleton count={1} width={675} height={845} />
      ) : (
        <img onClick={handleDoubleClick} src={src} alt={caption} />
      )}
    </div>
  );
};

export default Image;
