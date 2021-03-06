import { useState, useEffect, useContext, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import useUser from "../../hooks/use-user";
import FirebaseContext from "../../context/firebase";
import { isUserFollowingProfile, toggleFollow } from "../../services/firebase";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import Modal from "react-modal";

const Header = ({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers = [],
    following = [],
    username: profileUsername,
  },
  followerCount,
  setFollowerCount,
}) => {
  const { storage } = useContext(FirebaseContext);
  const [url, setUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const modal = useRef();

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const path = await storage
          .ref(`/images/avatars/${profileUsername}.jpg`)
          .getDownloadURL();
        setUrl(path);
      } catch {
        setUrl(
          `https://firebasestorage.googleapis.com/v0/b/instagram-clone-51c6b.appspot.com/o/images%2Favatars%2Fdefault%2Fdefault.jpg?alt=media&token=8758bd13-c26b-474a-82bf-a4c28278a141`
        );
      }
    };

    if (profileUsername) {
      getAvatar();
    }
  }, [storage, profileUsername]);

  const { user } = useUser();
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (user.username && profileUserId && user.username !== profileUsername) {
      isLoggedInUserFollowingProfile();
    }
  }, [user.username, profileUserId, profileUsername]);

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });

    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };

  Modal.setAppElement("#root");
  const handleChangeProfile = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = async (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (image) {
      const uploadTask = storage
        .ref(`images/avatars/${user.username}.jpg`)
        .put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(`images/avatars/${user.username}.jpg`)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
            });
        }
      );
    }
  }, [image, storage, user.username]);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <div className="container flex justify-center">
          {!!url ? (
            <>
              <img
                src={`${url}`}
                alt={`${profileUsername}`}
                className={`rounded-full h-40 w-40 flex ${
                  !activeBtnFollow && "cursor-pointer"
                }`}
                onClick={handleChangeProfile}
              />
              {!activeBtnFollow && isModalOpen && (
                <div
                  ref={modal}
                  className="h-10 w-48 rounded-md bg-white bg-opacity-80 flex justify-center items-center absolute top-0 bottom-0 left-0 ml-20 border-2 border-gray-base"
                >
                  <input
                    type="file"
                    id="uploadProfile"
                    hidden
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="uploadProfile"
                    className="text-blue-500 font-semibold cursor-pointer"
                  >
                    Change Profile Photo
                  </label>
                </div>
              )}
            </>
          ) : (
            <Skeleton count={1} width={160} height={160} />
          )}
        </div>
        <div className="flex items-center mt-2 flex-col col-span-2">
          <div className="container flex items-center">
            <p className="text-2xl mr-4">{profileUsername}</p>
            {activeBtnFollow && (
              <button
                className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8 z-10"
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <div className="container flex mt-4">
            {followers === undefined || following === undefined ? (
              <Skeleton count={1} width={677} />
            ) : (
              <>
                <p className="mr-10">
                  <span className="font-semibold">{photosCount}</span>
                  {` `}
                  {photosCount === 1 ? `post` : `posts`}
                </p>
                <p className="mr-10">
                  <span className="font-semibold">{followerCount}</span>
                  {` `}
                  {followerCount === 1 ? `follower` : `followers`}
                </p>
                <p className="mr-10">
                  <span className="font-semibold">{following.length}</span>
                  {` `} following
                </p>
              </>
            )}
          </div>
          <div className="container mt-4">
            <p className="font-medium">
              {!fullName ? <Skeleton count={1} height={24} /> : fullName}
            </p>
          </div>
          {!activeBtnFollow && (
            <>
              <div className="container flex mt-3">
                <Link
                  to={ROUTES.UPLOAD}
                  className="bg-blue-insta text-white px-5 py-3"
                >
                  Upload Post
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
