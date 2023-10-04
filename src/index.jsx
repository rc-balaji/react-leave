import { useState } from "react";
import "./App.css";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebase/firebase";
import { useNavigate } from "react-router-dom";

export function Index() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  // const signInGL = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await signInWithPopup(auth, provider);
  //     navigate("/home");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  const signIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, user, pass);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="signin-container"
      style={{ marginLeft: 550, marginTop: 150 }}
    >
      <div className="signin-header-container">
        <h1 className="signin-header">Sign In</h1>
        <p className="signin-subheader">
          Welcome back! Sign in to your account.
        </p>
      </div>
      <form onSubmit={signIn} className="signin-form">
        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setUser(e.target.value)}
          required
          className="signin-input"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPass(e.target.value)}
          required
          className="signin-input"
        />
        <button type="submit" className="signin-button">
          Sign In
        </button>
        {/* <button onClick={signInGL} className="signin-google-button">
          Sign In with Google
        </button> */}
      </form>
      <p className="signup-link">
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} className="signup-button">
          Sign Up
        </button>
      </p>
    </div>
  );
}
