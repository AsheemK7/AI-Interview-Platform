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

            {/* USER INFO PILL */}
            <div
              className="
                flex items-center gap-4
                px-8 py-5
                rounded-full
                bg-white/5
                border border-white/10
                min-w-[280px]
                shadow-lg
              "
            >
              {/* Avatar */}
              <div
                className="
                  w-14 h-14
                  rounded-full
                  bg-gradient-to-br
                  from-blue-500 to-purple-600
                  flex items-center justify-center
                  font-bold text-white text-xl
                  shadow-md
                "
              >
                {user.firstName?.charAt(0)?.toUpperCase()}
              </div>

              {/* Welcome Text */}
              <div className="leading-tight">
                <p className="text-sm text-slate-400">
                  Welcome back 👋
                </p>

                <p className="text-white font-bold text-xl">
                  {user.firstName}
                </p>
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="
                bg-gradient-to-r
                from-red-500 to-rose-600
                hover:scale-105
                hover:shadow-red-500/30
                transition-all duration-300
                text-white
                px-8 py-4
                rounded-3xl
                font-bold
                shadow-xl
                text-base
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