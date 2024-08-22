import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";
const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    console.log(event.target);
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const { name, email, password, buttonText } = values;

  const signupForm = () => (
    <form className="myForm">
      <div className="form-group">
        <label>Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control inp"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          onChange={handleChange("email")}
          value={email}
          type="email"
          className="form-control inp"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="password"
          className="form-control inp"
        />
      </div>
      <br></br>
      <button onClick={clickSubmit} className="btn btn-primary alignBtn">
        {buttonText}
      </button>
    </form>
  );
  const navigate = useNavigate();
  const redirectTo = () => {
    // history.push('/');
    navigate("/");
  };
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? redirectTo() : null}
        {/* {JSON.stringify({name, email, password})} */}
        <h1 className="p-5 text-center">Signup</h1>
        {signupForm()}
        <br />
        <div className="myForm">
          <Link
            to={"/auth/password/forgot"}
            className="btn btn-sm btn-outline-danger"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
