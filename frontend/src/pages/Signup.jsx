import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Start your AI interview journey today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    /* 🔥 MOVING GRADIENT */
    background:
      "linear-gradient(-45deg, #020617, #0f172a, #1e3a8a, #4c1d95, #0369a1)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 15s ease infinite",

    fontFamily: "sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "2.5rem",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    marginBottom: "0.3rem",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
    color: "#cbd5e1",
  },

  row: {
    display: "flex",
    gap: "10px",
  },

  input: {
    width: "100%",
    padding: "0.9rem",
    marginBottom: "1rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "0.9rem",
    borderRadius: "10px",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    padding: "0.6rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
  },

  footer: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },

  link: {
    color: "#818cf8",
    textDecoration: "none",
    fontWeight: "600",
  },
};