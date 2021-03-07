import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../../context/firebase";
import Skeleton from "react-loading-skeleton";

const Header = ({ username }) => {
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
          "https://firebasestorage.googleapis.com/v0/b/instagram-clone-51c6b.appspot.com/o/images%2Favatars%2Fdefault%2Fdefault.jpg?alt=media&token=8758bd13-c26b-474a-82bf-a4c28278a141"
        );
      }
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
