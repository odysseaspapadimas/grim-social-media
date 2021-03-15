import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserContext from "./context/user";
import useAuthListener from "./hooks/use-auth-listener";

import * as ROUTES from "./constants/routes";
import ProtectedRoute from "./helpers/protected.route";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Profile = lazy(() => import("./pages/profile"));
const NotFound = lazy(() => import("./pages/not-found"));
const Upload = lazy(() => import("./pages/upload-post"));
const Chats = lazy(() => import("./pages/chats"));

const App = () => {
  const { user } = useAuthListener();

  return (
    <div className="font-raleway">
      <UserContext.Provider value={{ user }}>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <Route path={ROUTES.LOGIN} component={Login} />
              <Route path={ROUTES.SIGN_UP} component={Signup} />
              <ProtectedRoute user={user} path={ROUTES.CHATS} exact>
                <Chats />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.PROFILE} exact>
                <Profile />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.UPLOAD} exact>
                <Upload />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
                <Dashboard />
              </ProtectedRoute>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </UserContext.Provider>
    </div>
  );
};

export default App;
