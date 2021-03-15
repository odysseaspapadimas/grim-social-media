import { useEffect, useState, useContext } from "react";
import FirebaseContext from "../../../context/firebase";
import Skeleton from "react-loading-skeleton";

const Inbox = ({
  sender,
  setSelectedChat,
  lastMessage: { sender: lastMessageSender, text: lastText },
}) => {
  const { storage } = useContext(FirebaseContext);

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const path = await storage
          .ref(`/images/avatars/${sender}.jpg`)
          .getDownloadURL();
        setAvatarUrl(path);
      } catch (error) {
        setAvatarUrl(
          "https://firebasestorage.googleapis.com/v0/b/instagram-clone-51c6b.appspot.com/o/images%2Favatars%2Fdefault%2Fdefault.jpg?alt=media&token=8758bd13-c26b-474a-82bf-a4c28278a141"
        );
      }
    };
    if (sender) {
      getAvatar();
    }
  }, [storage, sender]);
  return (
    <div
      onClick={() => setSelectedChat(sender)}
      className="border-b border-gray-primary flex pl-6 items-center py-3 cursor-pointer"
    >
      {!!!avatarUrl ? (
        <Skeleton count={1} width={48} height={48} />
      ) : (
        <img src={avatarUrl} alt="User profile" className="w-12 rounded-full" />
      )}
      <div className="flex flex-col ml-2">
        <h1 className="font-semibold">{sender}</h1>
        <div className="flex text-sm text-gray-600">
          {lastMessageSender && lastMessageSender === "me" && (
            <p className="pr-1">You: </p>
          )}
          <p>{lastText.length < 20 ? lastText : `${lastText.slice(40)}...`}</p>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
