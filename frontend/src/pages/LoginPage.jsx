import React, { useState, useEffect } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Load session
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Email validation
  const isValidEmail = (email) => {
    return email.endsWith("@psgtech.ac.in");
  };

  // SIGNUP
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

  // LOGIN
  const handleLogin = () => {
    setError("");

    if (!isValidEmail(email)) {
      return setError("Only for Psg tech students allowed");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return setError("Invalid credentials");
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    setUser(foundUser);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  // Logged in view
  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Welcome, {user.name}</h2>
          <p>Lost & Found Portal</p>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Form UI
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>
          {isSignup ? "Signup" : "Login"} - College Lost & Found
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email (@psgtech.ac.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          style={styles.button}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "#2563eb" }}
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "New user? Sign up"}
        </p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #e0e7ff, #f3f4f6)",
  },

  card: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "340px",
    textAlign: "center",
    transition: "0.3s",
  },

  title: {
    marginBottom: "20px",
    fontWeight: "600",
    color: "#1f2937",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
  },

  toggleText: {
    marginTop: "12px",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
  }
};