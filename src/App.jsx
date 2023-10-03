import React from "react";

import { Index } from ".";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Components/Home";
import { About } from "./Components/About";
import { Profile } from "./Components/Profile";
import { Contact } from "./Components/Contact";
import { SignUp } from "./Components/SignUp";
import { NotFound } from "./Components/NotFound";

import { Track } from "./Components/Track";
import { ApplyForLeave } from "./Components/ApplyForLeave";

// {NotFound}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track" element={<Track />} />
        <Route path="/apply" element={<ApplyForLeave />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
