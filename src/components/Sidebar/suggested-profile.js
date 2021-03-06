import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import FirebaseContext from "../../context/firebase";
import {
  updateMyFollowing,
  updateFollowedUsersFollowers,
} from "../../services/firebase";

const SuggestedProfile = ({
  docId,
  userDocId,
  username,
  profileId,
  userId,
}) => {
  const { storage } = useContext(FirebaseContext);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getAvatar = async () => {
      const path = await storage
        .ref(`/images/avatars/${username}.jpg`)
        .getDownloadURL();
      setUrl(path);
    };
    if (username) {
      getAvatar();
    }
  }, [storage, username]);

  const [followed, setFollowed] = useState(false);

  const handleFollowUser = async () => {
    setFollowed(!followed);

    await updateMyFollowing(docId, profileId, followed);
    await updateFollowedUsersFollowers(userDocId, userId);
  };
  // !followed if i can't make that
  return (
    <div className="flex flex-row items-center align-items justify-between py-2">
      <div className="flex items-center justify-between">
        {!!url ? (
          <img
            className="rounded-full w-8 flex mr-3"
            src={`${url}`}
            alt="Suggested user"
          />
        ) : (
          <Skeleton count={1} width={32} height={32} />
        )}

        <Link to={`/p/${username}`}>
          <p className="font-semibold text-sm">{username} </p>
        </Link>
      </div>
      <button
        className="text-sm font-semibold text-blue-500"
        type="button"
        onClick={handleFollowUser}
      >
        {!followed ? "Follow" : "Unfollow"}
      </button>
    </div>
  );
};

export default SuggestedProfile;
