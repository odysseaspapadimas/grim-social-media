import { useState, useContext } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import "emoji-mart/css/emoji-mart.css";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker } from "emoji-mart";

const AddComment = ({ docId, comments, setComments, commentInput }) => {
  const { app, FieldValue } = useContext(FirebaseContext);
  const {
    user: { displayName },
  } = useContext(UserContext);

  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [comment, setComment] = useState("");
  const [posted, setPosted] = useState(0);

  const handleSubmitComment = (e) => {
    e.preventDefault();

    setComments([...comments, { displayName, comment, posted }]);
    setComment("");

    return app
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({ displayName, comment }),
      });
  };

  return (
    <div className="border-t border-gray-300">
      <form
        className="flex w-full justify-between"
        onSubmit={(e) => {
          comment.length >= 3 ? handleSubmitComment(e) : e.preventDefault();
        }}
        method="POST"
      >
        {isEmojiOpen && (
          <NimblePicker
            set="facebook"
            data={data}
            showSkinTones={false}
            showPreview={false}
            onSelect={(emoji) => setComment(comment + emoji.native)}
            style={{ position: "absolute", marginTop: -350 }}
          />
        )}
        <button
          type="button"
          style={{ outline: "none" }}
          onClick={() => setIsEmojiOpen(!isEmojiOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 pl-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray w-full mr-3 py-5 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-500 ${
            comment.length < 3 && "opacity-25"
          } p-2 pr-5`}
          type="button"
          onClick={handleSubmitComment}
          disabled={comment.length < 3}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
