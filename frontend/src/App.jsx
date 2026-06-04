import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Interview from "./pages/Interview";

function LoadingScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
        color: "#555",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "4px solid #ddd",
          borderTop: "4px solid #4f46e5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem",
        }}
      />
      Loading your experience...
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" replace />;
}

// Layout for authenticated pages only
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// 404 Page
function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        flexDirection: "column",
      }}
    >
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/interview/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Interview />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}