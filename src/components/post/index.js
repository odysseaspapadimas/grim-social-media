import { useState, useRef } from "react";
import Actions from "./actions";
import Comments from "./comments";
import Footer from "./footer";
import Header from "./header";
import Image from "./image";

const Post = ({ content, imageSrc }) => {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  const [likes, setLikes] = useState(content.likes.length);

  const [toggleLiked, setToggleLiked] = useState(content.userLikedPhoto);

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-16">
      <Header username={content.username} />
      <Image
        caption={content.caption}
        likes={content.likes}
        totalLikes={likes}
        setLikes={setLikes}
        docId={content.docId}
        likedPhoto={content.userLikedPhoto}
        src={imageSrc}
        toggleLiked={toggleLiked}
        setToggleLiked={setToggleLiked}
      />
      <Actions
        docId={content.docId}
        likes={content.likes}
        totalLikes={likes}
        setLikes={setLikes}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
        toggleLiked={toggleLiked}
        setToggleLiked={setToggleLiked}
      />
      <Footer caption={content.caption} username={content.username} />
      <Comments
        docId={content.docId}
        comments={content.comments}
        posted={content.dateCreated}
        commentInput={commentInput}
      />
    </div>
  );
};

export default Post;
