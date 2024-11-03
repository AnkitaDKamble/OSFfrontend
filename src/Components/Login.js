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
          setShowSuccess(true);
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
    // Redirect to login after closing the modal
    setTimeout(() => {
      navigate('/home');
    }, 200); // Delay for smoother experience
  };

  const handleCloseError = () => {
    setShowError(false);
    // Redirect to login after closing the error modal
    setTimeout(() => {
      navigate('/login');
    }, 200); // Delay for smoother experience
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#808080' }}>
      <div className="card bg-dark text-light" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
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
            <div className="form-group mb-3">
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
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
            <div className="text-center mt-3">
              <span>
                Not registered?{' '}
                <Link
                  className={`nav-link ${location.pathname === "/signup" ? "active" : ""} text-primary`}
                  to="/signup"
                  style={{ textDecoration: 'underline' }}
                >
                  Signup
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for Successful Login */}
      <Modal show={showSuccess} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have logged in successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Login Error */}
      <Modal show={showError} onHide={handleCloseError} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invalid mobile number or password. Please try again.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
