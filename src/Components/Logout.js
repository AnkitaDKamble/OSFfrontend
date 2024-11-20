import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const Logout = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false); // For modal visibility

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          credentials: 'include', // Include cookies for session
        });

        if (response.ok) {
          console.log('Logout successful');
          localStorage.removeItem('isLoggedIn'); // Clear login state
          setShowSuccess(true); // Show the success modal
        } else {
          console.error('Logout failed:', await response.json());
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logoutUser();
  }, []);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Redirect to the login page after closing the modal
    navigate('/login');
  };

  return (
    <div className="container text-center">
      <h1>Logging out...</h1>
      <p>You will be redirected to the login page shortly.</p>
debugger
      {/* Modal for Successful Logout */}
      <Modal show={showSuccess} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Logout Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have been logged out successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Logout;
