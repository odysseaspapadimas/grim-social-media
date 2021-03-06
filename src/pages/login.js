import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";

import * as ROUTES from "../constants/routes";

const Login = () => {
  const { app } = useContext(FirebaseContext);
  const history = useHistory();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await app.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  useEffect(() => {
    document.title = "Login - Grim";
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4">
          <span className="flex justify-center w-full">
            <h1 className="font-semibold text-3xl">Grim</h1>
          </span>

          {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

          <form onSubmit={handleLogin} method="POST">
            <input
              aria-label="Enter your email address"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              type="text"
              placeholder="Email address"
              value={emailAddress}
              onChange={({ target }) => setEmailAddress(target.value)}
            />
            <input
              aria-label="Enter your password"
              className="text-sm w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-500 text-white w-full rounded h-8 font-bold ${
                isInvalid && "cursor-not-allowed opacity-50"
              }`}
            >
              Log In
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to={ROUTES.SIGN_UP} className="font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
