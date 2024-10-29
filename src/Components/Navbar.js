// src/components/Navbar.js
import React from 'react'
import { Link, useLocation } from "react-router-dom";

  

const Navbar = () => {
    let location = useLocation();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Omkar Steel Fabricators</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>

                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/order"? "active": ""}`} to="/order">Order</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/careers"? "active": ""}`} to="/careers">Careers</Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/contactus"? "active": ""}`} to="/contactus">Contac Us</Link>
                        </li>

                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/aboutus"? "active": ""}`} to="/aboutus">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/signup"? "active": ""}`} to="/signup">Signup</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname==="/login"? "active": ""}`} to="/login">Login</Link>
                        </li>

                    </ul>
                   
                </div>
            </div>
        </nav>
    )
}

export default Navbar
