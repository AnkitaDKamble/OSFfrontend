import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [addr, setAddr] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!/^\d{10}$/.test(mobile)) {
      errors.mobile = 'Mobile number should be exactly 10 digits';
    }

    if (!addr) {
      errors.addr = 'Address is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/signup`, {
          username: name,
          email,
          mobile,
          addr,
          password,
        });

        console.log(response.data);
        setShowSuccess(true);
        setName('');
        setEmail('');
        setMobile('');
        setAddr('');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error('Signup error details:', error);
        if (error.response && error.response.status === 400) {
          setErrors({ ...errors, email: 'User already exists' });
        } else {
          setErrors({ ...errors, general: 'An error occurred. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setTimeout(() => {
      navigate('/login'); // Redirect to login page after 2 seconds
    }, 2000);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMobile(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(value);
  };

  const handleAddrChange = (e) => {
    const value = e.target.value; // No need for filtering here, as address can have spaces
    setAddr(value);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#808080' }}>
      <div className="card text-white bg-dark" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '10px' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Sign Up</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control bg-secondary text-white"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
                maxLength="40"
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                type="email"
                className="form-control bg-secondary text-white"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength="30"
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                className="form-control bg-secondary text-white"
                id="mobile"
                value={mobile}
                onChange={handleMobileChange}
                required
                maxLength="10"
              />
              {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                className="form-control bg-secondary text-white"
                id="address"
                value={addr}
                onChange={handleAddrChange}
                required
                maxLength="100"
              />
              {errors.addr && <small className="text-danger">{errors.addr}</small>}
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
                maxLength="20"
              />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                maxLength="20"
              />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>
            <button type="submit" className="btn btn-primary btn-block my-3" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
            {errors.general && <small className="text-danger">{errors.general}</small>}
            <div className="text-center mt-3">
              <span>
                Already registered?
                <Link
                  className={`nav-link ${location.pathname === "/login" ? "active" : ""} text-primary`}
                  to="/login"
                  style={{ textDecoration: 'underline' }}
                >
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for Successful Sign Up */}
      <Modal show={showSuccess} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have signed up successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUp;
