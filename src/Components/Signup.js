import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ API URL (build-time injected)
const API_URL = process.env.REACT_APP_API_URL;

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [addr, setAddr] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Validation ----------
  const validate = () => {
    const errs = {};

    if (!name.trim()) errs.name = "Name is required";

    if (email && !/\S+@\S+\.\S+/.test(email))
      errs.email = "Email is invalid";

    if (!/^\d{10}$/.test(mobile))
      errs.mobile = "Mobile number must be 10 digits";

    if (!addr.trim()) errs.addr = "Address is required";

    if (!password) errs.password = "Password is required";

    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!API_URL) {
      setErrors({ general: "API not configured. Please try later." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_URL}/api/signup`, {
        username: name,
        email,
        mobile,
        addr,
        password,
      });

      console.log("Signup success:", response.data);

      setShowSuccess(true);
      setName("");
      setEmail("");
      setMobile("");
      setAddr("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        setErrors({
          general: error.response.data.message || "Signup failed",
        });
      } else {
        setErrors({
          general: "Server not reachable",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  // ---------- Input handlers ----------
  const handleMobileChange = (e) => {
    setMobile(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleNameChange = (e) => {
    setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""));
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#808080" }}
    >
      <div
        className="card text-white bg-dark"
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "10px",
        }}
      >
        <div className="card-body">
          <h5 className="card-title text-center">Sign Up</h5>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control bg-secondary text-white"
                value={name}
                onChange={handleNameChange}
                maxLength={40}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* Email */}
            <div className="form-group mb-2">
              <label>Email (optional)</label>
              <input
                type="email"
                className="form-control bg-secondary text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={30}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* Mobile */}
            <div className="form-group mb-2">
              <label>Mobile</label>
              <input
                type="tel"
                className="form-control bg-secondary text-white"
                value={mobile}
                onChange={handleMobileChange}
                maxLength={10}
              />
              {errors.mobile && (
                <small className="text-danger">{errors.mobile}</small>
              )}
            </div>

            {/* Address */}
            <div className="form-group mb-2">
              <label>Address</label>
              <textarea
                className="form-control bg-secondary text-white"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                maxLength={100}
              />
              {errors.addr && (
                <small className="text-danger">{errors.addr}</small>
              )}
            </div>

            {/* Password */}
            <div className="form-group mb-2">
              <label>Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
              />
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={20}
              />
              {errors.confirmPassword && (
                <small className="text-danger">
                  {errors.confirmPassword}
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            {errors.general && (
              <small className="text-danger d-block mt-2">
                {errors.general}
              </small>
            )}

            <div className="text-center mt-3">
              Already registered?{" "}
              <Link
                to="/login"
                className={`text-primary ${
                  location.pathname === "/login" ? "active" : ""
                }`}
                style={{ textDecoration: "underline" }}
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have signed up successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
