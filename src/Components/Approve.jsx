import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { app } from "../firebase/firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import "./Home.css"; // Import the CSS file
import { auth } from "../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#f2f2f2",
    fontWeight: "bold",
    textAlign: "left",
    padding: "8px",
  },
  td: {
    textAlign: "left",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  pendingRow: {
    backgroundColor: "white", // Yellow color for pending applications
  },
  noDataMessage: {
    fontStyle: "italic",
  },
};

export default function Approve() {
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
        // Create a query to retrieve leave applications, ordered by applied date
        const q = query(
          leavesCollection,
          orderBy("timestamp", "desc") // Order by timestamp in descending order (latest first)
          // You can add a limit here if needed
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      {/* <Navbar /> */}
      <div className="home-container">
        {/* <div className="remaining-days">
          No. of Days Remaining: {remainingDays}
        </div> */}
        <div className="leave-applications">
          <h2>Approved Leave Applications</h2>
          {leaveApplications.length === 0 ? (
            <p style={styles.noDataMessage}>
              No Approved Leave Applications Available
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>S.no</th>
                  <th style={styles.th}>Apply Date</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>From</th>
                  <th style={styles.th}>To</th>
                  <th style={styles.th}>No of Days</th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications
                  .filter((application) => application.status === "approved")
                  .map((application, index) =>
                    application.userId === user.uid ? (
                      <tr
                        key={application.id}
                        style={
                          application.status === "approved"
                            ? styles.pendingRow
                            : {}
                        }
                      >
                        <td style={styles.td}>{index + 1}</td>
                        <td style={styles.td}>{application.appliedDate}</td>
                        <td style={styles.td}>{application.subject}</td>
                        <td style={styles.td}>
                          {application.from.toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          {application.to.toLocaleDateString()}
                        </td>
                        <td style={styles.td}>{application.noOfDays}</td>
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
}
