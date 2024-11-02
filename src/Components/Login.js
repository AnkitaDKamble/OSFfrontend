// src/Login.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";

const Login = () => {
  let location = useLocation();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const errors = {};

    // Mobile number validation: exactly 10 digits
    if (mobile && !/^\d{10}$/.test(mobile)) {
      errors.mobile = 'Mobile number should be exactly 10 digits';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Set the showSuccess state to true to display the modal
      setShowSuccess(true);
      console.log('Mobile:', mobile);
      console.log('Password:', password);
    }
  };

  const handleClose = () => setShowSuccess(false);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#808080' }}>
      <div className="card text-white bg-dark" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                className="form-control bg-secondary text-white"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyUp={validate}
                required
                maxLength="10"
              />
              {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block my-3">
              Login
            </button>
            
            <div className="text-center mt-3">
  <span>
    Not registered? 
    <Link 
      className={`nav-link ${location.pathname === "/signup" ? "active" : ""} text-primary`} // Added text-primary here
      to="/signup" 
      style={{ textDecoration: 'underline' }} // Keep only the underline style here
    >
      Signup
    </Link>
  </span>
</div>

          </form>
        </div>
      </div>

      {/* Modal for Successful Login */}
      <Modal show={showSuccess} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have logged in successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
