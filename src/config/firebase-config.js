import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "google_api",
  authDomain: "Domain",
  databaseURL: "URL",
  projectId: "planpal-final",
  storageBucket: "storageBucket",
  messagingSenderId: "SenderId",
  appId: "1:SenderId:web:78adcec825ee0fc8784f33",
  measurementId: "Id"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);