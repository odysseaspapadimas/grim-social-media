import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getUserByUserId, getUserFollowedPhotos } from "../services/firebase";

const useFollowedUsersPhotos = () => {
  const [photos, setPhotos] = useState(null);
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);

  useEffect(() => {
    const getTimelinePhotos = async () => {
      const loggedInUser = await getUserByUserId(userId);
      if (loggedInUser && loggedInUser[0].following.length > 0) {
        const followedUserPhotos = await getUserFollowedPhotos(
          userId,
          loggedInUser[0].following
        );
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      } else {
        console.log("oops");
      }
    };
    getTimelinePhotos();
  }, [userId]);

  return { photos };
};

export default useFollowedUsersPhotos;
