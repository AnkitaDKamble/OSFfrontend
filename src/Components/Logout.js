import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          credentials: 'include', // Include cookies for session
        });

        if (response.ok) {
          console.log('Logout successful');
          // Redirect to the login page after a 2-second timeout
          setTimeout(() => {
            console.log('Logout response:', response);
            navigate('/login');
          }, 2000); // 2000 ms = 2 seconds
        } else {
          console.error('Logout failed:', await response.json());
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="container text-center">
      <h1>Logging out...</h1>
      <p>You will be redirected to the login page shortly.</p>
    </div>
  );
};

export default Logout;
