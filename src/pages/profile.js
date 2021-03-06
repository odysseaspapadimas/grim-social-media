import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getUserByUsername } from "../services/firebase";
import * as ROUTES from "../constants/routes";
import Header from "../components/Header";
import UserProfile from "../components/Profile";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [userExists, setUserExists] = useState();

  useEffect(() => {
    const checkUserExists = async () => {
      const user = await getUserByUsername(username);

      if (user.length > 0) {
        setUser(user[0]);
        setUserExists(true);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    };

    checkUserExists();
  }, [username]);

  return userExists ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
    </div>
  ) : null;
};

export default Profile;
