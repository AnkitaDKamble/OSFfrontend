import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const validate = () => {
    const validationErrors = {};
    if (!mobile) {
      validationErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
      validationErrors.mobile = 'Mobile number should be exactly 10 digits';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
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

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
          const { token, role } = data;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', role);

            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);

            setShowSuccess(true);

            // Trigger storage event to update Navbar and other components
            window.dispatchEvent(new Event('storage')); 
          } else {
            console.error('Token not found in response');
            setShowError(true);
          }
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
    navigate('/'); // Redirect to home page after successful login
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#808080' }}
    >
      <div className="card bg-dark text-light" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              />
              {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-warning">
                Login
              </button>
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
          <Button variant="success" onClick={handleCloseSuccess}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showError} onHide={handleCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Invalid mobile number or password. Please try again.</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseError}>
            Retry
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;