import React, { useState } from 'react';
import wi1 from './wi1.png';
import First from './First.png';
import doors from './doors.jpg';
import shed from './shed.jpeg';
import ghar from './ghar.jpg';
import jeena from './Jeena.jpeg';
import r from './r.jpeg';
import shu from './shu.jpeg';
import more from './more.jpeg';

function Order() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderTitle, setOrderTitle] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [error, setError] = useState('');

  const handleOrderClick = (title) => {
    setOrderTitle(title);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);

    if (lengthNum <= 0 || widthNum <= 0 || isNaN(lengthNum) || isNaN(widthNum)) {
      setError('Please enter valid positive numbers for length and width.');
    } else {
      setError('');
      setShowModal(false);
      setShowConfirmation(true);
      setLength('');
      setWidth('');
    }
  };

  const closeConfirmation = () => setShowConfirmation(false);

  // List of items with image source and title
  const items = [
    { title: 'Window', image: wi1 },
    { title: 'Door', image: doors },
    { title: 'Gate', image: First },
    { title: 'Shed', image: shed },
    { title: 'Ghar Roopkam', image: ghar },
    { title: 'Jeena', image: jeena },
    { title: 'Railing', image: r },
    { title: 'Shutter', image: shu },
    { title: 'And many more', image: more }
  ];

  return (
    <div className="container">
      <div className="row">
        {items.map((item, index) => (
          <div className="col-md-4" key={index}>
            <div className="card" style={{ height: '400px', marginBottom: '20px' }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img className="card-img-top" src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">150 Per Square foot</p>
                <button onClick={() => handleOrderClick(item.title)} className="btn btn-primary">Place Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for placing order */}
      {showModal && (
        <div className="modal show" style={{ display: 'block', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Place Your Order for {orderTitle}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Length (in feet)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Width (in feet)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  {error && <div className="text-danger">{error}</div>}
                  <button type="submit" className="btn btn-primary">Submit Order</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="modal show" style={{ display: 'block', zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thank You!</h5>
                <button type="button" className="btn-close" onClick={closeConfirmation}></button>
              </div>
              <div className="modal-body">
                <p>
                  Order placed for <strong>{orderTitle}</strong>.<br />
                  Omkar Steel Fabricators team will connect with you soon.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmation}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
