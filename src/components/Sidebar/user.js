import { memo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import FirebaseContext from "../../context/firebase";

const User = ({ username, fullName }) => {
  const { storage } = useContext(FirebaseContext);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const path = await storage
          .ref(`/images/avatars/${username}.jpg`)
          .getDownloadURL();
        setUrl(path);
      } catch {
        setUrl(
          `https://firebasestorage.googleapis.com/v0/b/instagram-clone-51c6b.appspot.com/o/images%2Favatars%2Fdefault%2Fdefault.jpg?alt=media&token=8758bd13-c26b-474a-82bf-a4c28278a141`
        );
      }
    };
    if (username) {
      getAvatar();
    }
  }, [storage, username]);

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <div className="grid grid-cols-4 gap-4 mb-4 items-center">
      <div className="flex items-center justify-between col-span-1">
        <Link to={`/p/${username}`}>
          {!!url ? (
            <div className="inline-block relative w-16 h-16 overflow-hidden rounded-full">
              <img
                className="rounded-full w-auto h-full flex mr-3 object-cover"
                src={`${url}`}
                alt="My profile"
              />
            </div>
          ) : (
            <Skeleton count={1} width={62} height={62} />
          )}
        </Link>
      </div>
      <div className="col-span-3">
        <Link to={`/p/${username}`}>
          <p className="font-semibold text-sm">{username}</p>
        </Link>
        <p className="text-gray-600 text-sm">{fullName}</p>
      </div>
    </div>
  );
};
export default memo(User);
