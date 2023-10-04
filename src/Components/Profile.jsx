import React, { useEffect, useState } from "react";
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
  const [facultyData, setFacultyData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

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
        setFacultyData({});
        setLoading(false); // Stop loading when there is no user
      }
    });

     const fetchFacultyData = async (userId) => {
    try {
      const db = getFirestore();
      const facultyCollection = collection(db, "faculty");

      const q = query(facultyCollection, where("userId", "==", userId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const facultyData = {};

        querySnapshot.forEach((doc) => {
          facultyData.id = doc.id;
          facultyData.name = doc.data().name;
          facultyData.department = doc.data().department;
          // Add other fields as needed

          // Set loading to false since data retrieval is complete
          setLoading(false);
        });

        setFacultyData(facultyData);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
    
  }, []);

  useEffect(()=>{
    
  },[]
 
  )
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h2 className="profile-header">Profile</h2>
        {user ? (
          <div className="profile-card">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="profile-info">
                  <h3>Personal Information</h3>
                  <p>
                    <strong>Name:</strong> {facultyData.name}
                  </p>
                  <p>
                    <strong>Department:</strong> {facultyData.department}
                  </p>
                  {/* Add other fields as needed */}
                </div>
              </>
            )}
          </div>
        ) : (
          <p>Please sign in to view your profile.</p>
        )}
      </div>
    </div>
  );
}
