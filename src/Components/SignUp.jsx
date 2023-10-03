import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firestore"; // Import Firestore
import { getFirestore, collection, addDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css"; // Import the CSS file

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [reConfirmPassword, setReConfirmPassword] = useState("");

  const Create = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (pass !== reConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create user authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user,
        pass
      );

      // Get the unique user ID
      const userId = userCredential.user.uid;

      // Get Firestore instance
      const db = getFirestore();

      // Define the Firestore collection reference
      const userCollection = collection(db, "faculty");

      // Create a new document with a unique ID
      await addDoc(userCollection, {
        userId: userId, // Add the user ID to the document
        name: name,
        department: department,
        email: userCredential.user.email,
        remainingLeaves: 10,
      });

      alert("Account created successfully");
      navigate("/");
    } catch (err) {
      alert(err.message);
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
        <input type="submit" value="Sign Up" className="signup-button" />
      </form>
      <p className="signin-link">
        Already have an account?{" "}
        <button onClick={() => navigate("/")}>Sign In</button>
      </p>
    </div>
  );
}
