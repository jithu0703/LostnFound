import React, { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => email.endsWith("@psgtech.ac.in");

  const handleSignup = () => {
    setError("");

    if (!isValidEmail(email)) {
      return setError("Only @psgtech.ac.in emails allowed");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return setError("User already exists. Please login.");
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setError("Signup successful! Please login.");
    setIsSignup(false);
  };

  const handleLogin = () => {
    setError("");

    if (!isValidEmail(email)) {
      return setError("Only @psgtech.ac.in emails allowed");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return setError("Invalid credentials");
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    if (onLoginSuccess) onLoginSuccess(foundUser);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      {/* Subtle overlay to preserve the visibility of the landing page */}
      <div className="absolute inset-0 bg-black/10" onClick={onClose}></div>
      
      {/* Glassmorphism Modal Card */}
      <div className="relative bg-white/[0.03] backdrop-blur-[32px] border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[400px] text-center transform transition-all ring-1 ring-white/5">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-lost-muted hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="font-syne font-bold text-2xl text-white mb-6 tracking-wide">
          {isSignup ? "Join the Network" : "Enter the Portal"}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-lost-mid border border-white/5 text-white p-3 mb-3 rounded-lg outline-none focus:border-found-gold/50 transition-colors font-sans"
          />
        )}

        <input
          type="email"
          placeholder="Email (@psgtech.ac.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-lost-mid border border-white/5 text-white p-3 mb-3 rounded-lg outline-none focus:border-found-gold/50 transition-colors font-sans"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-lost-mid border border-white/5 text-white p-3 mb-4 rounded-lg outline-none focus:border-found-gold/50 transition-colors font-sans"
        />

        {error && <p className="text-red-400 font-syne text-sm mb-4">{error}</p>}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full py-3 bg-found-gold text-white font-syne font-bold rounded-lg shadow-[0_4px_14px_rgba(200,147,58,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(200,147,58,0.6)] transition-all uppercase tracking-wider text-sm cursor-pointer"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="mt-6 text-lost-muted font-sans text-sm cursor-pointer hover:text-white transition-colors"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Lost in the dark? Sign up"}
        </p>
      </div>
    </div>
  );
}
