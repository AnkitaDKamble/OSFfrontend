import React from 'react';
const Footer = () => {
  return (
    <>
      <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>A/P Titave Tal: Radhanagari, District: Kolhapur.</p>
               <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>PIN:416208</p>
              <p className="mb-2"> <i class="fas fa-phone"></i> +91 9881278909</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>ankitakamblemay@gmail.com</p>
              
 
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-youtube"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Components</h4>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
              <a className="btn btn-link" href="/">...</a><br></br>
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light text-white fw-bold mb-4">Quick Links</h4>
              <a className="btn btn-link text-white fw-bold" href="/Home"><bold>Home</bold></a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Order"><bold>Order</bold></a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Careers">Careers</a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Contactus">Contact Us</a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Aboutus">About Us</a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Signup">Sign Up</a><br></br>
              <a className="btn btn-link text-white fw-bold" href="/Login">Log in</a><br></br>
         
            </div>
          </div>
        </div>
      

        <div class="container">
            <div class="copyright">
                <div class="row">
                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        © <a class="border-bottom text-white" href="#">Omkar Steel Fabrication</a>, All Right Reserved.
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        Website Designed By <a class="border-bottom text-white" href="/" >Ankita D. Kamble</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
    </>
  );
};

export default Footer;
