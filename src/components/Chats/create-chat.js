import { useState } from "react";
import {
  checkForChatWithUser,
  doesUsernameExist,
} from "../../services/firebase";
import Modal from "react-modal";

const CreateChat = ({ selectedChat, setSelectedChat, userDocId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUsername, setSelectedUsername] = useState("");

  Modal.setAppElement("#root");
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 11,
    },
    content: {
      zIndex: 12,
      width: 400,
      height: 550,
      position: "absolute",
      margin: "auto",
      padding: 0,
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
    },
  };

  const selectUser = async () => {
    const doesUsernameExistResult = await doesUsernameExist(selectedUsername);
    if (doesUsernameExistResult.length !== 0) {
      await checkForChatWithUser(userDocId, selectedUsername);

      setSelectedChat(selectedUsername);
    }
  };

  return (
    <>
      <div className="flex-2 border border-gray-primary self-stretch flex flex-col justify-center items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-insta w-1/4 text-white py-2 px-2 rounded   "
        >
          Send Message
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
      >
        <div className="flex justify-evenly w-full items-center mt-4">
          <label>To:</label>
          <input
            className="border border-gray-primary ml-2"
            type="text"
            name="user"
            placeholder="Enter user"
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}
          />
          <button
            onClick={selectUser}
            className="bg-blue-insta w-1/4 text-white py-1 px-2 rounded"
          >
            Select
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CreateChat;
