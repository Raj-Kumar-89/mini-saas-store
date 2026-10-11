import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaLayerGroup, FaHeart, FaBars, FaTimes, FaSignOutAlt, FaThLarge, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("recentlyViewedTemplates");
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-zinc-50 text-zinc-700"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
    }`;

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link to="/templates" onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <FaLayerGroup size={19} />
          </span>

          <span className="text-lg font-bold tracking-tight text-zinc-950 sm:text-xl">
            SaaSTemplates
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/templates" className={linkClass}>
            <FaThLarge size={15} /> Explore
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/favorites" className={linkClass}>
                <FaHeart size={15} /> Favorites
              </NavLink>

              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>

              {/* User Avatar */}
              <div className="ml-3 flex items-center gap-2 border-l border-zinc-200 pl-4">
                <span title={user?.name || "User"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-sm font-bold text-black">
                  {initial || <FaUserCircle size={18} />}
                </span>

                <div className="max-w-32">
                  <p className="truncate text-sm font-semibold text-zinc-900">{user?.name || "User"}</p>
                  <p className="text-xs text-zinc-500">Account</p>
                </div>
              </div>

              <button type="button" onClick={handleLogout}
                className="ml-2 flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                <FaSignOutAlt size={15} /> Log out
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}
          className="rounded-xl p-2 text-zinc-700 transition hover:bg-zinc-100 md:hidden">
          {menuOpen ? <FaTimes size={21} /> : <FaBars size={21} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="space-y-2 border-t border-zinc-200 bg-white px-4 py-4 md:hidden">
          {isAuthenticated && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-zinc-700">
                {initial || <FaUserCircle size={20} />}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-zinc-500">Signed in</p>
              </div>
            </div>
          )}

          <NavLink to="/templates" className={linkClass} onClick={() => setMenuOpen(false)}>
            <FaThLarge size={15} />
            Explore templates
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}>
                <FaHeart size={15} />
                Favorites
              </NavLink>

              <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>

              <button type="button" onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50">
                <FaSignOutAlt size={15} />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                Log in
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}