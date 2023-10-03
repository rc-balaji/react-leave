import { app } from "./firebase.js";

import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

 export  function signInEP(email,pass){

    signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
     
      const user = userCredential.user;
      console.log("Sign in Succesfully");
      return true
      
    })
    .catch((error) => {
        console.error(error.message);
        return false
      
    });

}

export function setAuthChange() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
    }
  });
}

export function createUserGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((err) => console.error(err.message));
}

export function createUserEP(email, pass) {
  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Account Created Successfully");
    })
    .catch((err) => {
      console.error(err.message);
    });
}
