import { useReducer, useEffect } from "react";
import { getUserPhotosByUserId } from "../../services/firebase";
import Header from "./header";
import Photos from "./photos";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  profile: {},
  photosCollection: [],
  followerCount: 0,
};

const Profile = ({ user }) => {
  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const getProfileInfoAndPhotos = async () => {
      const photos = await getUserPhotosByUserId(user.userId);
      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers.length,
      });
    };

    getProfileInfoAndPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userId]);

  return (
    <div>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      <Photos
        photos={photosCollection.sort((a, b) => b.dateCreated - a.dateCreated)}
        profile={profile}
      />
    </div>
  );
};

export default Profile;
