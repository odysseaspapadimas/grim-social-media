import Skeleton from "react-loading-skeleton";
import useFollowedUsersPhotos from "../hooks/use-followed-users-photos";
import Post from "./post";

const Timeline = () => {
  const { photos, moreThanOneUser } = useFollowedUsersPhotos();
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
          <Post key={content.docId} index={index} content={content} moreThanOne={moreThanOneUser} />
        ))
      ) : (
        // <img key={content.docId} src={content.imageSrc} alt="" />
        <p className="text-center text-2xl">Follow people to see photos!</p>
      )}
    </div>
  );
};

export default Timeline;
