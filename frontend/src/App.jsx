import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PostsPage from "./pages/PostsPage";
import MessagesPage from "./pages/MessagesPage";
import PostDetailsPage from "./pages/PostDetailsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/posts" 
          element={
            <ProtectedRoute>
              <PostsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/posts/:id" 
          element={
            <ProtectedRoute>
              <PostDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
