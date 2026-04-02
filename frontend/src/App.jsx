import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
