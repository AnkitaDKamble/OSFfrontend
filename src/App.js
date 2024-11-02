// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Aboutus from './Components/Aboutus';
import Footer from './Components/Footer';
import Contactus from './Components/Contactus';
import Home from './Components/Home';
import Careers from './Components/Careers';
import Order from './Components/Order';
import Logout from './Components/Logout';


function App() {
  return (
    
    <Router>
      <Navbar />
      <br/>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          
          <Route path="/careers" element={<Careers />} />
          <Route path="/order" element={<Order />} />
          <Route path="/logout" element={<Logout />} />
          {/* Add more routes here as needed */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
    
  );
}

export default App;
