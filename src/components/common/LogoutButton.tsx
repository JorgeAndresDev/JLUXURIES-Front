// src/components/LogoutButton.tsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="px-4 py-2 rounded-xl bg-black border border-blue-500/40 text-white">
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-black border border-blue-500/40 text-white shadow-[0_0_8px_#1E6BFF33]"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
