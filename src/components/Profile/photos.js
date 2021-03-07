import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import FirebaseContext from "../../context/firebase";
import PostModal from "./post-modal";

const Photos = ({
  photos,
  profile: { username: profileUsername, userId: profileUserId },
}) => {
  const { storage } = useContext(FirebaseContext);

  const [urls, setUrls] = useState([]);
  const [sortedUrls, setSortedUrls] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIndex, setPostIndex] = useState(0);

  useEffect(() => {
    const getPhotos = async () => {
      const images = await storage
        .ref()
        .child(`images/users/${profileUsername}/`);
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
          console.log(error);
        });

      setLoaded(true);
    };

    if (profileUsername) {
      setUrls([]);
      setSortedUrls([]);
      getPhotos();
    }
  }, [profileUsername, storage]);

  useEffect(() => {
    urls.sort((a, b) => {
      const subA = a.substring(
        a.indexOf(`${profileUsername}%2F`),
        a.indexOf(".jpg")
      );
      const subB = b.substring(
        b.indexOf(`${profileUsername}%2F`),
        b.indexOf(".jpg")
      );

      a = subA.substring(subA.indexOf("F") + 1, subA.length);
      b = subB.substring(subB.indexOf("F") + 1, subB.length);
      return b - a;
    });
    setSortedUrls(urls);
  }, [urls, profileUsername]);

  useEffect(() => {
    //console.log(sortedUrls, "sortedUrls");
  }, [sortedUrls]);

  return (
    <div
      className="h-16 border-t border-gray-primary mt-10 pt-4"
      style={{ marginBottom: 620 }}
    >
      <div className="grid grid-cols-3 gap-8 mt-4">
        {!loaded &&
        sortedUrls.length === photos.length &&
        sortedUrls[urls.length - 1] ? (
          <div className="flex justify-between">
            <Skeleton className="mx-5" count={1} width={288} height={288} />
            <Skeleton className="mx-5" count={1} width={288} height={288} />
            <Skeleton className="mx-5" count={1} width={288} height={288} />
          </div>
        ) : (
          photos.map((photo, index) => {
            return (
              <div
                key={photo.docId}
                className="relative group w-72 h-72 cursor-pointer"
                onClick={(e) => {
                  setIsModalOpen(true);
                  setPostIndex(index);
                }}
              >
                <img
                  className="h-full w-full object-cover"
                  src={sortedUrls[index]}
                  alt={photo.caption}
                />

                <div
                  className={`${index} absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden`}
                >
                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {photos[photos.length - index - 1].likes.length}
                  </p>

                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {photos[photos.length - index - 1].comments.length}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!photos ||
        (photos.length === 0 && (
          <p className="text-center text-2xl">No Posts Yet</p>
        ))}

      {isModalOpen && (
        <PostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          userId={profileUserId}
          postIndex={postIndex}
          username={profileUsername}
        />
      )}
    </div>
  );
};

export default Photos;
