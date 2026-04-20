import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [addr, setAddr] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { username, email, mobile, addr } = response.data;
        setName(username);
        setEmail(email || '');
        setMobile(mobile);
        setAddr(addr);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
    fetchUserData();
  }, []);

  const validate = () => {
    const errors = {};

    if (!name.trim()) errors.name = 'Name is required';
    if (email && !/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    if (!/^\d{10}$/.test(mobile)) errors.mobile = 'Mobile number must be exactly 10 digits';
    if (!addr.trim()) errors.addr = 'Address is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          'http://localhost:5000/api/profile',
          {
            username: name,
            email,
            mobile,
            addr,
            password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShowSuccess(true);
        setPassword('');
      } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        setErrors({ general: 'An error occurred while updating the profile. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setMobile(value);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(value);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <i className="bi bi-person-circle profile-icon"></i>
          <h2 className="profile-title">My Profile</h2>
          <div className="title-underline"></div>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-person-fill me-2"></i>
              Full Name
            </label>
            <input
              type="text"
              className={`form-control profile-input ${errors.name ? 'is-invalid' : ''}`}
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              maxLength="40"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-envelope-fill me-2"></i>
              Email Address
              <span className="optional-badge">Optional</span>
            </label>
            <input
              type="email"
              className={`form-control profile-input ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength="30"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-phone-fill me-2"></i>
              Mobile Number
            </label>
            <input
              type="tel"
              className={`form-control profile-input ${errors.mobile ? 'is-invalid' : ''}`}
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter 10 digit mobile number"
              maxLength="10"
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Address
            </label>
            <textarea
              className={`form-control profile-textarea ${errors.addr ? 'is-invalid' : ''}`}
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="Enter your address"
              rows="3"
              maxLength="100"
            />
            {errors.addr && <div className="error-message">{errors.addr}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="bi bi-lock-fill me-2"></i>
              New Password
              <span className="optional-badge">Optional</span>
            </label>
            <input
              type="password"
              className="form-control profile-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (leave blank to keep current)"
              maxLength="20"
            />
            <div className="field-hint">Leave blank to keep your current password</div>
          </div>

          {errors.general && (
            <div className="alert-general">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="profile-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-save-fill me-2"></i>
                Update Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered className="success-modal">
        <Modal.Header closeButton className="success-modal-header">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Profile Updated!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="success-modal-body">
          <div className="success-icon">
            <i className="bi bi-emoji-smile-fill"></i>
          </div>
          <p>Your profile has been updated successfully!</p>
          <p className="text-muted small">Your changes have been saved.</p>
        </Modal.Body>
        <Modal.Footer className="success-modal-footer">
          <Button className="success-btn" onClick={() => setShowSuccess(false)}>
            <i className="bi bi-check2-circle me-2"></i>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;