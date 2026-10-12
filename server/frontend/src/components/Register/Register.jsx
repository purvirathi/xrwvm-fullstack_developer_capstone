import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const gohome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    const register_url = window.location.origin + "/djangoapp/register";

    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    });

    const json = await res.json();
    if (json.status) {
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="register_container" style={{ width: "50%", margin: "5% auto" }}>
      <div className="header" style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="text" style={{ fontSize: "2em", fontWeight: "bold" }}>Sign Up</span>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" onClick={() => { gohome(); }} style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            Close
          </a>
        </div>
        <hr />
      </div>

      <form onSubmit={register}>
        <div className="inputs">
          <div className="input">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input_field"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="input_field"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="input_field"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input_field"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <label>Password</label>
            <input
              name="psw"
              type="password"
              placeholder="Password"
              className="input_field"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="submit_panel">
          <input className="submit" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;