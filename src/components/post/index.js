import { useState, useRef, useEffect, useContext } from "react";
import Actions from "./actions";
import Comments from "./comments";
import Footer from "./footer";
import Header from "./header";
import Image from "./image";
import FirebaseContext from "../../context/firebase";
import useUser from "../../hooks/use-user";

const Post = ({ content, index }) => {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  const { storage } = useContext(FirebaseContext);
  const { user } = useUser();

  const [urls, setUrls] = useState([]);
  const [sortedUrls, setSortedUrls] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getPhotos = async () => {
      const images = await storage
        .ref()
        .child(`images/users/${content.username}/`);
      images
        .list()
        .then((res) => {
          res.items.forEach((image) => {
            image.getDownloadURL().then((url) => {
              setUrls((urls) => [...urls, url]);
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
      setLoaded(true);
    };

    if (content.username) {
      getPhotos();
    }
  }, [content.username, storage]);

  useEffect(() => {
    setSortedUrls([...urls].sort().reverse());
  }, [urls]);

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-16">
      <Header username={content.username} />
      <Image
        caption={content.caption}
        likes={content.likes}
        docId={content.docId}
        src={
          sortedUrls.length > 1 && user.following.length > 1
            ? sortedUrls[index - 1]
            : sortedUrls[index]
        }
        loaded={loaded}
      />
      <Actions
        docId={content.docId}
        totalLikes={content.likes.length}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
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
