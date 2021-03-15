import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import FirebaseContext from "../context/firebase";
import useUser from "../hooks/use-user";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Inboxes from "../components/Chats/Inboxes";
import Chat from "../components/Chats/chat";
import CreateChat from "../components/Chats/create-chat";

const Chats = () => {
  const { app } = useContext(FirebaseContext);
  const { user } = useUser();

  const messagesRef = app
    .firestore()
    .collection("users")
    .doc(user.docId)
    .collection("chats");
  const query = messagesRef.orderBy("sender");
  const [chats] = useCollectionData(query, { idField: "id" });

  const [selectedChat, setSelectedChat] = useState(false);

  useEffect(() => {
    document.title = "Chats";
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center -mt-3">
        <div
          className="flex justify-center items-center"
          style={{ height: "89vh", width: "50vw" }}
        >
          <Inboxes chats={chats} setSelectedChat={setSelectedChat} />
          {!selectedChat ? (
            <CreateChat
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              userDocId={user.docId}
            />
          ) : (
            <Chat
              user={user}
              chat={
                chats?.length >= 1 &&
                chats.find((chat) => {
                  return chat.sender === selectedChat;
                })
              }
              otherUsername={
                chats &&
                chats
                  // eslint-disable-next-line array-callback-return
                  .map((chat) => {
                    if (chat.sender === selectedChat) {
                      return chat.sender;
                    }
                  })
                  .find((sender) => sender === selectedChat)
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Chats;
