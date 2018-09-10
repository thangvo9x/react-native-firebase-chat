/** @format */

import * as firebase from "firebase";

import Config from "./Config";

const firebaseApp = firebase.initializeApp(Config);
firebaseApp.getCurrentUser = function() {
  return firebaseApp.auth().currentUser;
};

firebaseApp.ref = () => {
  return firebaseApp.database().ref();
};

firebaseApp.on = callback => {
  return firebaseApp
    .ref()
    .child("chat")
    .limitToLast(1)
    .on("child_added", snapshot => {
      // console.log('snapshot', snapshot)
      callback(snapshot);
    });
};

firebaseApp.fetch = (author, callback) => {
  return firebaseApp
    .ref()
    .child("users")
    .child(author)
    .once(
      "value",
      snapshot => callback(snapshot.val()),
      errObj => {
        console.log("The read failed: " + errObj.code);
      }
    );
};

// close the connection to the Backend
firebaseApp.off = () => firebaseApp.ref().off();
export default firebaseApp;
