//Home.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from './img/First.png';
import Second from './img/Second.png';
import t from './img/t.png';
import f from './img/f.png';
import fi from './img/fi.png';
import s from './img/s.png';
import Service from './Service';


const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="bg-dark text-white text-center py-5">
        <div className="container">
          <h6>Welcome to</h6>
          <h1>Omkar Steel Fabricators</h1>
          <h4>Your Vision, Our Expertise !!!</h4>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Personalized Solutions for You</h5>
                  <p className="card-text">
                    We prioritize your unique needs, delivering customized solutions that align with your vision and budget.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Fast and Efficient Service</h5>
                  <p className="card-text">
                    Our advanced technology enables faster completion times without sacrificing quality, so you spend less time waiting.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Reliable Quality Assurance</h5>
                  <p className="card-text">
                    We uphold rigorous quality standards, ensuring every product is durable and precise for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Staying Competitive for Better Service</h5>
                  <p className="card-text">
                    Our commitment to innovation ensures you receive top-quality fabrication solutions tailored to your project needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Expanding Service Options</h5>
                  <p className="card-text">
                    We continually introduce new offerings to keep up with industry trends and meet your evolving requirements.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Time-Saving Processes</h5>
                  <p className="card-text">
                    With new measures in place, we’re reducing lead times by 15% in the next six months, bringing faster results without compromising quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="card mb-4 shadow-sm bg-dark text-light">
        <div className="card-body">
          <h1 className="card-title text-warning text-center">About Us</h1>
          <p className="card-text my-3">
            Our expertise, coupled with our commitment to innovation and sustainability, ensures that working with us is a seamless experience. We provide detailed project management, transparent communication, and timely delivery, allowing our customers to focus on their core goals while we handle the complexities of fabrication.
          </p>
          <p className="card-text my-3">
            When you choose Omkar Steel Fabricators, you're not just getting a service provider—you’re gaining a partner dedicated to helping you achieve success with the highest level of professionalism and quality.
          </p>
        </div>
      </div>

      <div className="container-xxl py-5" id="facilities">
        {/* Admin-specific links */}
       {/* <div className="container">*/}
          <div className="section-title text-center">
            
          <h1
  className="text-center mb-4"
  style={{
    fontFamily: 'Source Sans Pro, sans-serif',
    fontWeight: 600,
    fontStyle: 'italic'
  }}
>
  Our Facilities
</h1>


          </div>

          <Service/>
       {/*  </div>*/}
      </div>
    </div>
  );
};

export default Home;
