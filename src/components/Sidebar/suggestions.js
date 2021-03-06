import { useState, useEffect, memo } from "react";
import Skeleton from "react-loading-skeleton";
import { getSuggestedProfiles } from "../../services/firebase";
import SuggestedProfile from "./suggested-profile";

const Suggestions = ({ docId, userId, following }) => {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    const suggestedProfiles = async () => {
      const res = await getSuggestedProfiles(userId, following);
      setProfiles(res);
    };

    if (userId) {
      suggestedProfiles();
    }
  }, [userId, following]);

  return !profiles ? (
    <>
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-semibold text-gray-600">Suggestions for you</p>
      </div>
      <Skeleton count={5} height={48} width={321} />
    </>
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-semibold text-gray-600">Suggestions for you</p>
      </div>
      <div className="mt-4 grid gap-5"></div>
      {profiles.map((profile) => (
        <SuggestedProfile
          key={profile.docId}
          userDocId={profile.docId}
          username={profile.username}
          profileId={profile.userId}
          userId={userId}
          docId={docId}
        />
      ))}
    </div>
  ) : null;
};

export default memo(Suggestions);
