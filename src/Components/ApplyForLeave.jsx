import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { app } from "../firebase/firebase";
import {
  getFirestore,
  collection,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import "./ApplyForLeave.css"; // Import the CSS file
import { auth } from "../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const ApplyForLeave = () => {
  const [db, setDb] = useState(null);
  const [coll, setColl] = useState(null);
  const [userDocRef, setUserDocRef] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState("casual");
  const [noOfDays, setNoOfDays] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const firestore = getFirestore(app);
      setDb(firestore);

      const leavesCollection = collection(firestore, "leaves");
      setColl(leavesCollection);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);

          // Configure Firestore document reference
          const userId = user.uid;
          const userRef = doc(firestore, "faculty", userId);
          setUserDocRef(userRef);
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    const timeDifference = toDateObj - fromDateObj;
    const daysDifference = timeDifference / (1000 * 3600 * 24) + 1;

    setNoOfDays(daysDifference);
  }, [fromDate, toDate]);

  const Submit = async () => {
    if (!currentUser || noOfDays <= 0) return; // Check currentUser instead of user

    try {
      setLoading(true);

      await addDoc(coll, {
        subject: subject,
        from: fromDate,
        to: toDate,
        type: leaveType,
        noOfDays: noOfDays,
        userId: currentUser.uid, // Use currentUser.uid
        status: "pending",
        timestamp: serverTimestamp(),
      });

      // Update the remaining leaves count
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        // Document exists, update it
        const userData = docSnapshot.data();
        const updatedRemainingLeaves = userData.remainingLeaves - noOfDays;

        await updateDoc(userDocRef, {
          remainingLeaves: updatedRemainingLeaves,
        });
        console.log("Updated");
      } else {
        // Document doesn't exist, create it
        await setDoc(userDocRef, {
          userId: currentUser.uid,
          remainingLeaves: 10 - noOfDays, // Assuming an initial count of 10
        });
        console.log("Document created");
      }

      // Reset form fields and loading state
      setSubject("");
      setFromDate("");
      setToDate("");
      setLeaveType("casual");
      setNoOfDays(0);

      alert("Leave application submitted successfully.");
    } catch (error) {
      console.error("Error submitting leave application:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="apply-for-leave-container">
        <h2 className="apply-for-leave-header">Apply for Leave</h2>
        {currentUser ? (
          <div className="leave-form">
            <div className="leave-info">
              <div className="leave-info-row">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="leave-info-row">
                <label htmlFor="fromDate">From:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="leave-info-row">
                <label htmlFor="toDate">To:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="leave-info-row">
                <label htmlFor="leaveType">Leave Type:</label>
                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="casual">Casual</option>
                  <option value="medical">Medical</option>
                </select>
              </div>
              <div className="leave-info-row">
                <label>No of Days:</label>
                <span>{noOfDays}</span>
              </div>
            </div>
            <button
              className="submit-button"
              onClick={Submit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        ) : (
          <p>Please sign in to apply for leave.</p>
        )}
      </div>
    </div>
  );
};
