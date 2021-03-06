import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { app, FieldValue, storage } from "./lib/firebase";
import FirebaseContext from "./context/firebase";
import "./styles/app.css";

ReactDOM.render(
  <FirebaseContext.Provider value={{ app, FieldValue, storage }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
