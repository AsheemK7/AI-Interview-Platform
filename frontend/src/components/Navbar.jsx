import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Interviewer
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">

            {/* USER INFO PILL (ENHANCED SIZE) */}
            <div className="flex items-center gap-7 px-3 py-5 rounded-full bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">

              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
                {user.firstName?.charAt(0)?.toUpperCase()}
              </div>

              <div className="leading-tight">
                <p className="text-xs text-slate-400">
                  Welcome back 👋
                </p>

                <p className="text-white font-semibold text-sm">
                  {user.firstName}
                </p>
              </div>
            </div>

            {/* LOGOUT BUTTON (balanced + premium) */}
            <button
              onClick={handleLogout}
              className="
                bg-gradient-to-r from-red-500 to-rose-600
                hover:scale-105 hover:shadow-red-500/30
                transition-all duration-300
                text-white
                px-6 py-3
                rounded-2xl
                font-semibold
                shadow-lg
                text-sm
              "
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}