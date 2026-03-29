import { useState, useEffect } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isValidEmail = (email) => {
    return email.endsWith("@psgtech.ac.in");
  };

  const handleSignup = () => {
    setError("");

    if (!isValidEmail(email)) {
      return setError("Only @psgtech.ac.in emails allowed");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return setError("User already exists");
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
      return setError("Only PSG Tech students allowed");
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

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-80">
          <h2 className="text-xl font-bold mb-2">
            Welcome, {user.name}
          </h2>
          <p className="text-gray-600 mb-4">Lost & Found Portal</p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isSignup ? "Signup" : "Login"}
        </h2>
        <p className="text-center text-gray-500 mb-4">
          College Lost & Found
        </p>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email (@psgtech.ac.in)"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="text-center text-sm text-purple-600 mt-3 cursor-pointer hover:underline"
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
