import { formatDistance } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddComment from "./add-comment";

const Comments = ({ docId, comments: allComments, posted, commentInput }) => {
  const [comments, setComments] = useState(allComments);
  const [viewAllComments, setViewAllComments] = useState(false);

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.length > 3 && (
          <button
            onClick={() => setViewAllComments(!viewAllComments)}
            className="text-sm text-gray-600 mb-1 cursor-pointer"
          >
            {!viewAllComments
              ? ` View all ${comments.length} comments`
              : `Collapse comments`}
          </button>
        )}
        {!viewAllComments
          ? comments.slice(-3).map((item) => {
              return (
                <p key={`${item.comment}-${item.displayName}`} className="mb-1">
                  <Link to={`/p/${item.displayName}`}>
                    <span className="mr-1 font-semibold">
                      {item.displayName}
                    </span>
                  </Link>
                  <span>{item.comment}</span>
                </p>
              );
            })
          : comments.map((item) => {
              return (
                <p key={`${item.comment}-${item.displayName}`} className="mb-1">
                  <Link to={`/p/${item.displayName}`}>
                    <span className="mr-1 font-semibold">
                      {item.displayName}
                    </span>
                  </Link>
                  <span>{item.comment}</span>
                </p>
              );
            })}
        <p className="text-gray-600 uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
};

export default Comments;
