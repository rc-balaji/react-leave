import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { app } from "../firebase/firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import "./Home.css"; // Import the CSS file
import { auth } from "../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const Home = () => {
  const db = getFirestore(app);
  const leavesCollection = collection(db, "leaves");
  const user = auth.currentUser;
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [remainingDays, setRemainingDays] = useState(10); // You can initialize this with the actual number of days

  // Function to convert Firestore Timestamp to formatted date and time string
  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp) {
      return ""; // Return an empty string or another appropriate value when timestamp is null
    }

    const date = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Modify the query to retrieve data for the currently authenticated user
        const leavesQuery = query(
          leavesCollection,
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const unsubscribe = onSnapshot(leavesQuery, (querySnapshot) => {
          const applications = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const appliedDate = formatFirestoreTimestamp(data.timestamp);
            const from = new Date(data.from);
            const to = new Date(data.to);

            applications.push({
              id: doc.id,
              ...data,
              appliedDate,
              from,
              to,
            });
          });
          setLeaveApplications(applications);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [leavesCollection, user]);

  useEffect(() => {
    // Fetch the user's remaining leaves count and update "No. of Days Remaining"
    const fetchRemainingLeaves = async () => {
      if (!user) return;

      try {
        const leavesRef = doc(db, "faculty", user.uid);
        const docSnapshot = await getDoc(leavesRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const remainingLeaves = userData.remainingLeaves;
          setRemainingDays(remainingLeaves);
        }
      } catch (error) {
        console.error("Error fetching remaining leaves:", error);
      }
    };

    fetchRemainingLeaves();
  }, [db, user]);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="remaining-days">
          No. of Days Remaining: {remainingDays}
        </div>
        <div className="leave-applications">
          <h2>Recent Leave Applications</h2>
          {leaveApplications.length === 0 ? (
            <p>No Leave Applications Available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Applied Date</th>
                  <th>Subject</th>
                  <th>From</th>
                  <th>To</th>
                  <th>No. of Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications.map((application) =>
                  application.userId === user.uid ? (
                    <tr
                      key={application.id}
                      className={
                        application.status === "pending"
                          ? "pending"
                          : application.status === "approved"
                          ? "approved"
                          : application.status === "declined"
                          ? "declined"
                          : application.status === "canceled"
                          ? "canceled"
                          : ""
                      }
                    >
                      <td>{application.appliedDate}</td>
                      <td>{application.subject}</td>
                      <td>{application.from.toLocaleDateString()}</td>
                      <td>{application.to.toLocaleDateString()}</td>
                      <td>{application.noOfDays}</td>
                      <td>{application.status}</td>
                    </tr>
                  ) : (
                    ""
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
