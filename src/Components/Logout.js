import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import "./Logout.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const Logout = () => {
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          `${API_URL}/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Logout successful");

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("role");
        localStorage.removeItem("isLoggedIn");

        // Show success modal
        setShowSuccess(true);
      } catch (error) {
        console.error("Logout error:", error.message);

        // Even if backend fails — logout locally
        localStorage.clear();
        setShowSuccess(true);
      } finally {
        setLoading(false);
      }
    };

    logoutUser();
  }, []);

  const handleClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <div className="logout-container">

      {/* Loading Spinner */}
      {loading && (
        <div className="logout-loading">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3">Logging out...</p>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        show={showSuccess}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title className="text-success">
            Logout Successful
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">

          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "50px" }}
          ></i>

          <h4 className="mt-3">
            You have logged out successfully!
          </h4>

          <p className="text-muted">
            Thank you for visiting Omkar Steel Fabricators
          </p>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="warning"
            onClick={handleClose}
          >
            Go to Login
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default Logout;