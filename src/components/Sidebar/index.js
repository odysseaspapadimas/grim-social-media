import useUser from "../../hooks/use-user";
import Suggestions from "./suggestions";
import User from "./user";

const Sidebar = () => {
  const {
    user: { docId, userId, following, username, fullName } = {},
  } = useUser();

  return (
    <div className="p-4">
      <User username={username} fullName={fullName} />
      <Suggestions userId={userId} following={following} docId={docId}/>
    </div>
  );
};

export default Sidebar;
