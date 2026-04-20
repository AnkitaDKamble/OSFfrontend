import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import { Modal, Button, Spinner } from "react-bootstrap";
import './ForgotAndResetPassword.css';

// The main component for forgot and reset password functionality
const ForgotAndResetPassword = () => {
  const [step, setStep] = useState("forgot"); // "forgot", "verify", "reset"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(""); // store userId after OTP verification
  const [timeLeft, setTimeLeft] = useState(0); // countdown in seconds
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Timer effect to handle OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile) {
      setMessage("Please enter your registered mobile number.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", { mobile });
      setMessage(res.data.message);
      setStep("verify");
      setTimeLeft(240); // 4 min countdown
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { mobile, otp });
      setMessage(res.data.message);
      setUserId(res.data.userId);
      setStep("reset");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        userId,
        newPassword: password,
      });
      setMessage(res.data.message);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Password reset failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  const renderStepContent = () => {
    switch (step) {
      case "forgot":
        return (
          <div className="step-content">
            <div className="step-icon">
              <i className="bi bi-phone-fill"></i>
            </div>
            <h3 className="step-title">Enter Mobile Number</h3>
            <p className="step-description">We'll send a verification code to your registered mobile number</p>
            <div className="input-group-custom">
              <i className="bi bi-phone"></i>
              <input
                type="text"
                placeholder="Enter registered mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                maxLength="10"
                className="custom-input"
              />
            </div>
            <button 
              type="submit" 
              className="custom-btn custom-btn-primary"
              disabled={isLoading || !mobile}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send OTP
                </>
              )}
            </button>
          </div>
        );
      case "verify":
        return (
          <div className="step-content">
            <div className="step-icon">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h3 className="step-title">Verify OTP</h3>
            <p className="step-description">Enter the 6-digit code sent to {mobile}</p>
            <div className="input-group-custom">
              <i className="bi bi-key-fill"></i>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength="6"
                className="custom-input"
              />
            </div>
            <div className="otp-timer">
              <i className="bi bi-clock-history"></i>
              <span className={timeLeft <= 60 ? "timer-warning" : ""}>
                {timeLeft > 0 
                  ? `OTP expires in ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
                  : "OTP has expired. Please request a new one."}
              </span>
            </div>
            <button 
              type="submit" 
              className="custom-btn custom-btn-success"
              disabled={isLoading || !otp || timeLeft <= 0}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Verify OTP
                </>
              )}
            </button>
          </div>
        );
      case "reset":
        return (
          <div className="step-content">
            <div className="step-icon">
              <i className="bi bi-key-fill"></i>
            </div>
            <h3 className="step-title">Reset Password</h3>
            <p className="step-description">Create a new password for your account</p>
            <div className="input-group-custom">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
              />
            </div>
            <button 
              type="submit" 
              className="custom-btn custom-btn-primary"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Resetting...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Reset Password
                </>
              )}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header-custom">
          <i className="bi bi-shield-lock card-icon"></i>
          <h2 className="card-title">Forgot Password?</h2>
          <div className="title-underline"></div>
          <p className="card-subtitle">Reset your password in three simple steps</p>
        </div>

        <div className="steps-indicator">
          <div className={`step-indicator ${step === "forgot" ? "active" : step === "verify" || step === "reset" ? "completed" : ""}`}>
            <div className="step-number">1</div>
            <span>Mobile</span>
          </div>
          <div className={`step-line ${step === "verify" || step === "reset" ? "active" : ""}`}></div>
          <div className={`step-indicator ${step === "verify" ? "active" : step === "reset" ? "completed" : ""}`}>
            <div className="step-number">2</div>
            <span>Verify</span>
          </div>
          <div className={`step-line ${step === "reset" ? "active" : ""}`}></div>
          <div className={`step-indicator ${step === "reset" ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span>Reset</span>
          </div>
        </div>

        <form onSubmit={
          step === "forgot" ? handleSendOtp : 
          step === "verify" ? handleVerifyOtp : 
          handleResetPassword
        }>
          {renderStepContent()}
        </form>

        {message && (
          <div className={`message-alert ${message.includes('Error') || message.includes('failed') || message.includes('expired') ? 'error' : 'success'}`}>
            <i className={`bi ${message.includes('Error') || message.includes('failed') || message.includes('expired') ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2`}></i>
            {message}
          </div>
        )}

        <div className="back-to-login">
          <Link to="/login" className="back-link">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Login
          </Link>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={handleCloseSuccess} centered className="success-modal">
        <Modal.Header closeButton className="success-modal-header">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Password Reset Successful!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="success-modal-body">
          <div className="success-icon">
            <i className="bi bi-emoji-smile-fill"></i>
          </div>
          <p>Your password has been reset successfully!</p>
          <p className="text-muted small">Redirecting you to login page...</p>
        </Modal.Body>
        <Modal.Footer className="success-modal-footer">
          <Button className="success-btn" onClick={handleCloseSuccess}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForgotAndResetPassword;