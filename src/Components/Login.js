// src/Login.js
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#808080' }}>
      <div className="card text-white bg-dark" style={{ width: '25rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control bg-secondary text-white"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block my-3">
              Login
            </button>
            
            <p className="text-center mt-3">
              Not registered? <a href="/Signup" className="text-info">Create an account</a>
            </p>

            
      
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
