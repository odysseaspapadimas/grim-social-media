import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";

import { doesUsernameExist } from "../services/firebase";

const SignUp = () => {
  const { app } = useContext(FirebaseContext);
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid =
    username === "" ||
    fullName === "" ||
    password === "" ||
    emailAddress === "";

  const handleSignUp = async (event) => {
    event.preventDefault();

    const doesUsernameExistResult = await doesUsernameExist(username);
    if (doesUsernameExistResult && doesUsernameExistResult.length === 0) {
      try {
        const createdUserResult = await app
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        await app.firestore().collection("users").add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          followers: [],
          following: [],
          dateCreated: Date.now(),
        });

        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName("");
        setEmailAddress("");
        setPassword("");
        setError(error.message);
      }
    } else {
      setError("That username is already taken, please try another.");
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Grim";
  }, []);

  return (
    <div className="container flex mx-auto max-w-xs items-center h-screen">
      <div className="flex flex-col">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4">
        <span className="flex justify-center w-full">
        <h1 className="font-semibold text-3xl">Grim</h1>
      </span>
          {error && (
            <p className="mb-4 text-xs text-red-500 text-center">{error}</p>
          )}

          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="Enter your username"
              className="text-sm text-gray w-full mr-3 py-5 px-4 h-2 border border-gray-primary bg-gray-background rounded mb-2"
              type="text"
              placeholder="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value.toLowerCase())}
            />
            <input
              aria-label="Enter your full name"
              className="text-sm text-gray w-full mr-3 py-5 px-4 h-2 border border-gray-primary bg-gray-background rounded mb-2"
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
            />
            <input
              aria-label="Enter your email address"
              className="text-sm text-gray w-full mr-3 py-5 px-4 h-2 border border-gray-primary bg-gray-background rounded mb-2"
              type="text"
              placeholder="Email address"
              value={emailAddress}
              onChange={({ target }) =>
                setEmailAddress(target.value.toLowerCase())
              }
            />
            <input
              aria-label="Enter your password"
              className="text-sm text-gray w-full mr-3 py-5 px-4 h-2 border border-gray-primary bg-gray-background rounded mb-2"
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
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
          <p className="text-sm">
            Have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
