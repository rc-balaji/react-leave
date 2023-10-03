import { useEffect, useState } from "react";
import { auth } from "../firebase/firestore";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import "./Profile.css"; // Import the CSS file
import { Navbar } from "./Navbar";

export function Profile() {
  const [user, setUser] = useState(null);
  const [facultyData, setFacultyData] = useState([]);

  useEffect(() => {
    // Add a listener to watch for changes in the authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
        fetchFacultyData(currentUser.uid);
      } else {
        // No user is signed in
        setUser(null);
        setFacultyData([]); // Clear faculty data when no user is signed in
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const fetchFacultyData = async (userId) => {
    try {
      const db = getFirestore();
      const facultyCollection = collection(db, "faculty");

      const q = query(facultyCollection, where("userId", "==", userId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const facultyList = [];
        querySnapshot.forEach((doc) => {
          facultyList.push({ id: doc.id, ...doc.data() });
        });
        setFacultyData(facultyList);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-header">Profile</h2>
        {user ? (
          <div className="profile-card">
            <div className="profile-info">
              <h3>Personal Information</h3>
              {facultyData.length > 0 ? (
                <p>
                  <strong>Name:</strong> {facultyData[0].name}
                </p>
              ) : (
                <p>No faculty data found for this user.</p>
              )}
              {facultyData.length > 0 ? (
                <p>
                  <strong>Department:</strong> {facultyData[0].department}
                </p>
              ) : null}
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
        ) : (
          <p>Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
}
