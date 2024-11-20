import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const validate = () => {
    const errors = {};
    if (mobile && !/^\d{10}$/.test(mobile)) {
      errors.mobile = 'Mobile number should be exactly 10 digits';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile, password }),
        });

        if (response.ok) {
          localStorage.setItem('isLoggedIn', true); // Update localStorage
          setShowSuccess(true);

          // Retrieve the location from the login state (if any)
          const redirectTo = location.state?.from || '/home'; // Default to '/home' if no state

          setTimeout(() => {
            window.dispatchEvent(new Event('storage')); // Trigger the storage event for Navbar
            navigate(redirectTo); // Redirect to the previous page or home
          }, 200);
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error('Login error:', error);
        setShowError(true);
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setTimeout(() => {
      navigate('/home');
    }, 200);
  };

  const handleCloseError = () => {
    setShowError(false);
    setTimeout(() => {
      navigate('/login');
    }, 200);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#808080' }}>
      <div className="card bg-dark text-light" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
              />
              {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <div className="mt-3 text-center">
              <Link to="/signup" className="text-white">Don't have an account? Sign Up</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={handleCloseSuccess}>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Welcome back!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccess}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showError} onHide={handleCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invalid mobile number or password. Please try again.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseError}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
