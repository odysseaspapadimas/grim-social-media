import { useState, useRef, useEffect, useContext } from "react";
import FirebaseContext from "../../context/firebase";
import { sendMessage, updateMessageReadState } from "../../services/firebase";
import formatDistance from "date-fns/formatDistance";

const Chat = ({
  user: { username: myUsername, docId: myDocId },
  chat: { messages, id: otherDocId },
  otherUsername,
}) => {
  const { storage } = useContext(FirebaseContext);

  const dummy = useRef();
  const input = useRef();

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const getAvatar = async () => {
      try {
        const path = await storage
          .ref(`/images/avatars/${otherUsername}.jpg`)
          .getDownloadURL();
        setAvatarUrl(path);
      } catch (error) {
        setAvatarUrl(
          "https://firebasestorage.googleapis.com/v0/b/instagram-clone-51c6b.appspot.com/o/images%2Favatars%2Fdefault%2Fdefault.jpg?alt=media&token=8758bd13-c26b-474a-82bf-a4c28278a141"
        );
      }
    };
    if (otherUsername) {
      getAvatar();
    }

    input.current.focus();
    
    dummy.current.scrollIntoView();
  }, [storage, otherUsername]);

  useEffect(() => {
    updateMessageReadState(myDocId, otherDocId); //whenever a new message comes in update read state

    dummy.current.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(myDocId, otherDocId, message, myUsername, otherUsername);
    setMessage("");
  };

  return (
    <div
      className="flex-2 border border-gray-primary self-stretch flex flex-col justify-between"
      style={{ maxWidth: "35.52vw" }}
    >
      <div className="h-16 flex justify-start items-center border-b border-gray-primary">
        <div className="flex h-full ml-6 items-center">
          <img
            src={avatarUrl}
            alt="User profile"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="font-semibold ml-2">{otherUsername}</h1>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="flex flex-col overflow-y-scroll"
          style={{ height: "77.6vh" }}
        >
          {messages &&
            messages.map(({ text, sender, createdAt }, index) => {
              if (sender === "me") {
                return (
                  <div key={index} className="flex flex-col self-end">
                    <>
                      <p className=" mr-3 my-1 bg-blue-insta text-white py-2 px-5 rounded-3xl">
                        {text}
                      </p>
                    </>
                    <p className="text-sm text-gray-400 self-end pr-2">
                      {formatDistance(createdAt, new Date())}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex flex-col self-start">
                    <p className="ml-3 my-1 bg-gray-400 py-2 px-5 rounded-3xl">
                      {text}
                    </p>
                    <p className="text-sm text-gray-400 self-start pl-2">
                      {formatDistance(createdAt, new Date())}
                    </p>
                  </div>
                );
              }
            })}

          <div></div>
          <span ref={dummy}></span>
        </div>
        <form onSubmit={handleSendMessage} className="flex mt-3">
          <input
            ref={input}
            className="border-2 border-gray-primary w-full"
            type="text"
            placeholder="Message..."
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            disabled={!message}
            type="submit"
            className="p-2 text-blue-500 font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
