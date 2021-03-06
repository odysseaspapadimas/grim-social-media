import { useContext, useEffect } from "react";
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";
import "./actions.css";

const Actions = ({
  docId,
  setLikes,
  totalLikes,
  likedPhoto,
  handleFocus,
  toggleLiked,
  setToggleLiked,
}) => {
  const { app, FieldValue } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);

    await app
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(user.uid)
          : FieldValue.arrayUnion(user.uid),
      });

    setLikes((totalLikes) => (toggleLiked ? totalLikes - 1 : totalLikes + 1));
  };

  useEffect(() => {
    if (likedPhoto) {
      setToggleLiked(likedPhoto);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex">
          <svg
            onClick={() => handleToggleLiked((toggleLiked) => !toggleLiked)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleToggleLiked((toggleLiked) => !toggleLiked);
              }
            }}
            className={`w-10 mr-4 select-none cursor-pointer ${
              toggleLiked ? "fill-current text-red-500" : "text-black"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill={`${toggleLiked ? "red" : "none"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFocus();
              }
            }}
            className="w-8 text-black-light select-none cursor-pointer"
            enableBackground="new 0 0 511.072 511.072"
            viewBox="0 0 511.072 511.072"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Speech_Bubble_48_">
              <g>
                <path d="m74.39 480.536h-36.213l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-36.029-23.644-62.375-54.751-76.478-90.425-14.093-35.647-15.864-74.888-5.121-113.482 12.89-46.309 43.123-88.518 85.128-118.853 45.646-32.963 102.47-50.387 164.33-50.387 77.927 0 143.611 22.389 189.948 64.745 41.744 38.159 64.734 89.63 64.734 144.933 0 26.868-5.471 53.011-16.26 77.703-11.165 25.551-27.514 48.302-48.593 67.619-46.399 42.523-112.042 65-189.83 65-28.877 0-59.01-3.855-85.913-10.929-25.465 26.123-59.972 40.929-96.086 40.929zm182-420c-124.039 0-200.15 73.973-220.557 147.285-19.284 69.28 9.143 134.743 76.043 175.115l7.475 4.511-.23 8.727c-.456 17.274-4.574 33.912-11.945 48.952 17.949-6.073 34.236-17.083 46.99-32.151l6.342-7.493 9.405 2.813c26.393 7.894 57.104 12.241 86.477 12.241 154.372 0 224.682-93.473 224.682-180.322 0-46.776-19.524-90.384-54.976-122.79-40.713-37.216-99.397-56.888-169.706-56.888z" />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <p className="font-semibold">
          {totalLikes === 1 ? `${totalLikes} like` : `${totalLikes} likes`}
        </p>
      </div>
    </>
  );
};

export default Actions;
