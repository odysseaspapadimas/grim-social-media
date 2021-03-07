import { useState, useEffect, useContext } from "react";
import UserContext from "../context/user";
import { getUserByUserId, getUserFollowedPhotos } from "../services/firebase";

const useFollowedUsersPhotos = () => {
  const [photos, setPhotos] = useState(null);
  const [moreThanOneUser, setMoreThanOneUser] = useState(false);
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
        console.log(followedUserPhotos);
        let array = [];
        let followedUsers = followedUserPhotos.map((photo) => {
          console.log(photo.username);
          array.push(photo.username);
          return array.every((val, i, arr) => val === arr[0]);
        });
        console.log(followedUsers.includes(false), 'heree');
        setMoreThanOneUser(followedUsers.includes(false));
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      } else {
        console.log("oops");
      }
    };
    getTimelinePhotos();
  }, [userId]);

  return { photos, moreThanOneUser };
};

export default useFollowedUsersPhotos;
