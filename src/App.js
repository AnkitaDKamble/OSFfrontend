import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Aboutus from './Components/Aboutus';
import Footer from './Components/Footer';
import Contactus from './Components/Contactus';
import Home from './Components/Home';
import Service from './Components/Service';
import Logout from './Components/Logout';
import MyOrder from './Components/MyOrder';
import OrderDashboard from './Components/OrderDashboard';
import Profile from './Components/Profile';
import ServiceDashboard from './Components/ServiceDashboard';
import OrderHistory from './Components/OrderHistory';
import OrderHistoryDashboard from './Components/OrderHistoryDashboard';
import ForgotAndResetPassword from './Components/ForgotAndResetPassword';



function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  return (
    <Router>
     <Navbar />
      <br />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ForgotAndResetPassword" element={<ForgotAndResetPassword />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/service" element={<Service />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Orderdashboard" element={<OrderDashboard />} />
          <Route path="/Servicedashboard" element={<ServiceDashboard />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/OrderHistoryDashboard" element={<OrderHistoryDashboard />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
