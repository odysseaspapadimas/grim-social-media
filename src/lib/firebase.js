import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
//import {seedDatabase} from '../seed';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
});

const { FieldValue } = firebase.firestore;
const storage = firebase.storage();
//seedDatabase(app);

export { app, FieldValue, storage };
