import React, { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";
const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (location.pathname === path) {
      return {
        color: "black",
      };
    } else {
      return {
        color: "white",
      };
    }
  };

  const nav = () => {
    return (
      <div style={{ position: "sticky", top: 0 }}>
        <ul className="nav nav-tabs fs-6 fw-bold justify-content-center">
          <li className="nav-item">
            <Link to="/" className="nav-link" style={isActive("/")}>
              Home
            </Link>
          </li>
          {!isAuth() && (
            <Fragment>
              <li className="nav-item">
                <Link
                  to="/signin"
                  className="nav-link"
                  style={isActive("/signin")}
                >
                  Signin
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/signup"
                  className="nav-link"
                  style={isActive("/signup")}
                >
                  Signup
                </Link>
              </li>
            </Fragment>
          )}
          {isAuth() && isAuth().role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" style={isActive("/admin")} to="/admin">
                ADMIN
              </Link>
            </li>
          )}

          {isAuth() && isAuth().role === "student" && (
            <Fragment>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive("/private")}
                  to="/private"
                >
                  {isAuth().email.split("@")[0].toUpperCase()}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive("/dashboard")}
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            </Fragment>
          )}
          {isAuth() && isAuth().role === "admin" && (
            <Fragment>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive("/admindashboard")}
                  to="/admindashboard"
                >
                  Dashboard
                </Link>
              </li>
            </Fragment>
          )}

          {isAuth() && (
            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => {
                  signout(() => {
                    navigate("/");
                  });
                }}
                style={{ cursor: "pointer", color: "white" }}
              >
                Signout
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default Layout;
