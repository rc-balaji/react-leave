import React, { useState } from "react";
import AllApplications from "./All";
import PendingApplications from "./Pending";
import ApprovedApplications from "./Approve";
import DeclinedApplications from "./Decline";
import CancelledApplications from "./Cancelled";
import { Navbar } from "./Navbar";
import("./Track.css");

export const Track = () => {
  const [activePage, setActivePage] = useState("all"); // Default active page

  const renderPage = () => {
    switch (activePage) {
      case "all":
        return <AllApplications />;
      case "pending":
        return <PendingApplications />;
      case "approved":
        return <ApprovedApplications />;
      case "declined":
        return <DeclinedApplications />;
      case "cancelled":
        return <CancelledApplications />;
      default:
        return <AllApplications />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="track-container">
        {/* <h1 className="track-header">Leave Applications</h1> */}
        <nav>
          <ul className="track-nav">
            <li>
              <button
                className={`track-button ${
                  activePage === "all" ? "active" : ""
                }`}
                onClick={() => setActivePage("all")}
              >
                All
              </button>
            </li>
            <li>
              <button
                className={`track-button ${
                  activePage === "pending" ? "active" : ""
                }`}
                onClick={() => setActivePage("pending")}
              >
                Pending
              </button>
            </li>
            <li>
              <button
                className={`track-button ${
                  activePage === "approved" ? "active" : ""
                }`}
                onClick={() => setActivePage("approved")}
              >
                Approved
              </button>
            </li>
            <li>
              <button
                className={`track-button ${
                  activePage === "declined" ? "active" : ""
                }`}
                onClick={() => setActivePage("declined")}
              >
                Declined
              </button>
            </li>
            <li>
              <button
                className={`track-button ${
                  activePage === "cancelled" ? "active" : ""
                }`}
                onClick={() => setActivePage("cancelled")}
              >
                Cancelled
              </button>
            </li>
          </ul>
        </nav>
        <hr />

        {renderPage()}
      </div>
    </div>
  );
};
