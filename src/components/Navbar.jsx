import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoMdSunny, IoMdMoon } from "react-icons/io";
import { checkUser, login, logout } from "../features/userSlice";

function Navbar() {
  const [theme, setTheme] = useState(themeFromLocalStorage());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function themeFromLocalStorage() {
    return localStorage.getItem("theme") || "nord";
  }

  const handleTheme = () => {
    setTheme(prevTheme => prevTheme === "dracula" ? "nord" : "dracula");
  };

  const handleLogout = () => {
    signOut(logout)
      .then(() => {
        dispatch({ type: "LOG_OUT" });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="bg-base-200 mb-8">
      <div className="navbar site-container">
        <div className="navbar-start">
          <Link className="btn btn-primary font-bold text-2xl" to="/">
            BOOKS
          </Link>
        </div>
        <div className="navbar-center">
          <ul className="menu menu-horizontal gap-3">
            <li>
              <NavLink
                className="btn bg-blue-500 hover:bg-blue-700"
                activeClassName="btn-primary"
                exact
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className="btn bg-blue-500 hover:bg-blue-700"
                activeClassName="btn-primary"
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                className="btn bg-blue-500 hover:bg-blue-700"
                activeClassName="btn-primary"
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
           
          </ul>
        </div>
        <div className="navbar-end">
          <div className="navbar-end flex gap-4 mr-4">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                onChange={handleTheme}
                checked={theme === "dracula"}
              />
              <IoMdSunny className="swap-on fill-current w-10 h-10" />
              <IoMdMoon className="swap-off fill-current w-10 h-10" />
            </label>
          </div>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;