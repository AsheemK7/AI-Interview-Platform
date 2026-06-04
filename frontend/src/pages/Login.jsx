import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      login(res.data.token, res.data.user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Gradient Animation */}
      <style>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }

            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>
            Welcome Back 👋
          </h2>

          <p style={styles.subtitle}>
            Login to continue your AI
            interview journey
          </p>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p style={styles.footer}>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={styles.link}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background:
      "linear-gradient(-45deg, #020617, #0f172a, #1e3a8a, #6d28d9, #0369a1)",

    backgroundSize: "400% 400%",
    animation:
      "gradientMove 12s ease infinite",

    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "2.8rem",

    borderRadius: "28px",

    background:
      "rgba(255,255,255,0.08)",

    backdropFilter: "blur(22px)",
    WebkitBackdropFilter:
      "blur(22px)",

    border:
      "1px solid rgba(255,255,255,0.12)",

    boxShadow:
      "0 25px 60px rgba(0,0,0,0.35)",

    color: "#fff",
  },

  title: {
    textAlign: "center",
    marginBottom: "0.4rem",
    fontSize: "2rem",
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "1.8rem",
    fontSize: "0.95rem",
    color: "#cbd5e1",
  },

  input: {
    width: "100%",
    padding: "1rem",
    marginBottom: "1rem",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.15)",

    background:
      "rgba(255,255,255,0.08)",

    color: "#fff",
    outline: "none",
    fontSize: "1rem",
  },

  button: {
    width: "100%",
    padding: "1rem",
    borderRadius: "14px",
    border: "none",

    background:
      "linear-gradient(135deg, #2563eb, #7c3aed)",

    color: "#fff",
    fontWeight: "700",
    fontSize: "1rem",
    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(99,102,241,0.35)",

    transition: "0.3s ease",
  },

  error: {
    background:
      "rgba(239,68,68,0.15)",

    color: "#fca5a5",

    padding: "0.8rem",

    borderRadius: "12px",

    marginBottom: "1rem",
    textAlign: "center",
  },

  footer: {
    marginTop: "1.2rem",
    textAlign: "center",
    fontSize: "0.95rem",
    color: "#cbd5e1",
  },

  link: {
    color: "#818cf8",
    textDecoration: "none",
    fontWeight: "700",
  },
};