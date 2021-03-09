import { useEffect, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import FirebaseContext from "../context/firebase";
import useFollowedUsersPhotos from "../hooks/use-followed-users-photos";
import Post from "./post";

const Timeline = () => {
  const { photos } = useFollowedUsersPhotos();

  const { storage } = useContext(FirebaseContext);

  const [urls, setUrls] = useState([]);
  const [sortedUrls, setSortedUrls] = useState([]);

  useEffect(() => {
    const getPhotos = async () => {
      photos.map(async (photo, index) => {
        const imageUrl = await storage
          .ref(`${photo.imageSrc}`)
          .getDownloadURL();
        setUrls((urls) => [...urls, { imageUrl, index }]);
      });
    };

    if (photos) {
      getPhotos();
    }
  }, [photos, storage]);

  useEffect(() => {
    setSortedUrls([...urls].sort((a, b) => a.index - b.index));
  }, [urls]);
  return (
    <div className="container col-span-2">
      {!photos ? (
        <>
          {[...new Array(4)].map((_, index) => (
            <Skeleton key={index} count={1} width={320} height={400} />
          ))}
        </>
      ) : photos && photos.length > 0 ? (
        photos.map((content, index) => (
          <Post
            key={content.docId}
            content={content}
            imageSrc={sortedUrls[index]?.imageUrl}
          />
        ))
      ) : (
        // <img key={content.docId} src={content.imageSrc} alt="" />
        <p className="text-center text-2xl">Follow people to see photos!</p>
      )}
    </div>
  );
};

export default Timeline;
