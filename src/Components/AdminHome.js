import React from 'react';

const AdminHome = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card bg-dark text-light" style={{ width: '30rem' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Hello Admin</h5>
          <p className="text-center">Welcome to the Admin Dashboard</p>
          <div className="text-center">
            <button className="btn btn-warning" onClick={() => alert('Navigating to admin panel...')}>
              Go to Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
