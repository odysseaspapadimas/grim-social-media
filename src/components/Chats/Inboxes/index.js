import React, { useEffect } from "react";
import Inbox from "./inbox";

const Inboxes = ({ chats, setSelectedChat }) => {
  useEffect(() => {});

  return (
    <div className="flex-1 border-l border-t border-b border-gray-primary self-stretch">
      <div className="h-16 border-b border-gray-primary text-center flex flex-col justify-center items-center ">
        <h1 className="font-semibold">Inboxes</h1>
        <button
          onClick={() => setSelectedChat(false)}
          className="py-1 px-3 bg-blue-insta text-white rounded"
        >
          Back
        </button>
      </div>

      {chats &&
        chats
          .sort(
            (a, b) =>
              b.messages[b.messages.length - 1].createdAt -
              a.messages[a.messages.length - 1].createdAt
          )
          .map((chat) => {
            return (
              <Inbox
                key={chat.id}
                sender={chat.sender}
                setSelectedChat={setSelectedChat}
                lastMessage={{
                  sender: chat.messages[chat.messages.length - 1]?.sender,
                  text: chat.messages[chat.messages.length - 1]?.text,
                }}
              />
            );
          })}
    </div>
  );
};

export default Inboxes;
