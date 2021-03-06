import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../../context/firebase";
import Skeleton from "react-loading-skeleton";

const Header = ({ username }) => {
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

  return (
    <div className="flex border-b border-gray-primary h-4 p-8 px-6">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          {!!url ? (
            <img
              className="rounded-full h-8 w-8 flex mr-3"
              src={`${url}`}
              alt=""
            />
          ) : (
            <Skeleton count={1} width={32} height={32} />
          )}

          <p className="font-semibold">{username}</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
