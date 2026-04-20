import React, { useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');

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
      setIsLoading(true);
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
          const { token, role, username } = data;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', role);
            localStorage.setItem('customerName', username);
            
            setLoggedInUserName(username);

            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);

            // ✅ Set flag to show welcome popup on Home page
            localStorage.setItem('showWelcomePopup', 'true');
            
            setShowSuccess(true);

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
      } finally {
        setIsLoading(false);
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="bi bi-box-arrow-in-right login-icon"></i>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-phone-fill me-2"></i>
              Mobile Number
            </label>
            <input
              type="text"
              className={`form-control login-input ${errors.mobile ? 'is-invalid' : ''}`}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10 digit mobile number"
              maxLength="10"
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-lock-fill me-2"></i>
              Password
            </label>
            <input
              type="password"
              className={`form-control login-input ${errors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </>
              )}
            </button>
          </div>

          <div className="forgot-password-link">
            <Link to="/ForgotAndResetPassword">
              <i className="bi bi-question-circle me-1"></i>
              Forgot Password?
            </Link>
          </div>
        </form>

        <div className="signup-prompt">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={handleCloseSuccess} centered className="success-modal">
        <Modal.Header closeButton className="success-modal-header">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Login Successful!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="success-modal-body">
          <div className="success-icon">
            <i className="bi bi-emoji-smile-fill"></i>
          </div>
          <p>Welcome back, <strong className="user-name-highlight">{loggedInUserName || 'User'}</strong>!</p>
          <b>Happy to serve you again...</b>
        </Modal.Body>
        <Modal.Footer className="success-modal-footer">
          <Button className="success-btn" onClick={handleCloseSuccess}>
            <i className="bi bi-house-door me-2"></i>
            Go to Home
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showError} onHide={handleCloseError} centered className="error-modal">
        <Modal.Header closeButton className="error-modal-header">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Login Failed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="error-modal-body">
          <div className="error-icon">
            <i className="bi bi-x-circle-fill"></i>
          </div>
          <p>Invalid mobile number or password.</p>
          <p className="text-muted small">Please check your credentials and try again.</p>
        </Modal.Body>
        <Modal.Footer className="error-modal-footer">
          <Button className="error-btn" onClick={handleCloseError}>
            <i className="bi bi-arrow-repeat me-2"></i>
            Try Again
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;