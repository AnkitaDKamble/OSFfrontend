import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

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
      } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        setErrors({ general: 'An error occurred while updating the profile. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#808080' }}
    >
      <div
        className="card text-white bg-dark"
        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '10px' }}
      >
        <div className="card-body">
          <h5 className="card-title text-center">Profile</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control bg-secondary text-white"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setMobile(e.target.value)}
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
                onChange={(e) => setAddr(e.target.value)}
                maxLength="100"
              />
              {errors.addr && <small className="text-danger">{errors.addr}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password (optional)</label>
              <input
                type="password"
                className="form-control bg-secondary text-white"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength="20"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block my-3" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
            {errors.general && <small className="text-danger d-block text-center">{errors.general}</small>}
          </form>
        </div>
      </div>

      {/* Modal for Successful Update */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your profile has been updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccess(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
