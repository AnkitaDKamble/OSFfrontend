import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ServiceDashboard() {
  const [services, setServices] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', image: null });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (service) => {
    setEditMode(service._id);
    setFormData({ title: service.title, price: service.pricePerSquareFoot, image: null });
  };

  const handleSave = async (id) => {
    try {
      
      const updatedService = new FormData();
      updatedService.append('title', formData.title);
      updatedService.append('pricePerSquareFoot', formData.price);
      if (formData.image) updatedService.append('image', formData.image);

      const response = await axios.put(`http://localhost:5000/api/services/${id}`, updatedService, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setServices((prevServices) =>
        prevServices.map((service) => (service._id === id ? response.data : service))
      );
      setEditMode(null);
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      setServices((prevServices) => prevServices.filter((service) => service._id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleAddService = async () => {
    try {
      debugger
      const newService = new FormData();
      newService.append('title', 'New Service');
      newService.append('pricePerSquareFoot', 100);
      newService.append('image', '');

      const response = await axios.post('http://localhost:5000/api/services', newService, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setServices((prevServices) => [...prevServices, response.data]);
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Service Dashboard</h1>
      <button className="btn btn-success mb-3" onClick={handleAddService}>
        Add New Service
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Price (₹)</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service._id}>
              <td>{index + 1}</td>
              {editMode === service._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary me-2" onClick={() => handleSave(service._id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditMode(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{service.title}</td>
                  <td>{service.pricePerSquareFoot}</td>
                  <td>
                    {service.imagePath && (
                      <img src={`http://localhost:5000${service.imagePath}`} alt={service.title} width="100" />
                    )}
                  </td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(service)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceDashboard;
