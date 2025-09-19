import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    try {
      // This is the call to your backend, which will now use MSG91
      const res = await axios.post("http://localhost:5000/api/forgot-password", { mobile });
      setMessage(res.data.message);
      setStep("verify");
      setTimeLeft(240); // 4 min countdown
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP. Try again.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { mobile, otp });
      setMessage(res.data.message);
      setUserId(res.data.userId); // Save userId for reset
      setStep("reset");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed. Try again.");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("Please enter a new password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        userId,
        newPassword: password,
      });
      setMessage(res.data.message);
      setShowSuccess(true);
      
      // Redirect to the login page after a successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Password reset failed. Try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "forgot":
        return (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter registered mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Send OTP
            </button>
          </form>
        );
      case "verify":
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <button 
              type="submit" 
              className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={timeLeft <= 0}
            >
              Verify OTP
            </button>
            <p className="mt-2 text-center text-sm text-gray-500">
              {timeLeft > 0 
                ? `OTP expires in ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
                : "OTP has expired. Please request a new one."}
            </p>
          </form>
        );
      case "reset":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Reset Password
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl">
        <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Forgot / Reset Password
        </h3>
        {renderStep()}
        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.includes('Error') || message.includes('failed') || message.includes('expired') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        {showSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            Password reset successfully! Redirecting to login...
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotAndResetPassword;