import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firestore"; // Import Firestore
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css"; // Import the CSS file

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [reConfirmPassword, setReConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state
  const [userDocRef, setUserDocRef] = useState(null);

  const [uid, setUID] = useState("");
  useEffect(() => {
    // Add a listener to watch for changes in the authentication state
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // User is signed in
        const userId = currentUser.uid;
        // Get Firestore instance
        setUID(userId);
        const db = getFirestore();
        // Define the Firestore document reference with the custom user ID
        const docRef = doc(db, "faculty", userId);
        setUserDocRef(docRef);
      } else {
        // No user is signed in
        setUserDocRef(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const Create = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (pass !== reConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Set the loading state to true
      setLoading(true);

      // Create user authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user,
        pass
      );

      if (userDocRef) {
        // Set data in the document with the custom user ID
        await setDoc(userDocRef, {
          name: name,
          department: department,
          email: userCredential.user.email,
          remainingLeaves: 10,
          userId: uid,
        })
          .then(() => {
            alert("Account created successfully");
            navigate("/");
          })
          .catch((err) => console.error(err));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      // Set the loading state back to false
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-header">Sign Up</h1>
      <form onSubmit={Create} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department (IT, CSE, AIDS)"
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Re-confirm Password"
          onChange={(e) => setReConfirmPassword(e.target.value)}
          required
        />
        {/* Display a loading spinner when loading is true */}
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <input type="submit" value="Sign Up" className="signup-button" />
        )}
      </form>
      <p className="signin-link">
        Already have an account?{" "}
        <button onClick={() => navigate("/")}>Sign In</button>
      </p>
    </div>
  );
}
