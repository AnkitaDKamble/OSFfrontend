import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import './ServiceDashboard.css';

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [newServiceData, setNewServiceData] = useState({
    title: "",
    pricePerSquareFoot: "",
    image: null,
    imagePath: "",
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get("http://localhost:5000/api/services", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.data && Array.isArray(response.data.services)) {
        setServices(response.data.services);
      } else {
        console.error("Unexpected data structure for services:", response.data);
        setError("Failed to load services: Unexpected data format from server.");
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to load services.");
      } else {
        setError("Failed to load services: Network error or backend not reachable.");
      }
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewServiceData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleOpenAddEditModal = (service = null) => {
    setError("");
    setSuccessMessage("");
    setCurrentService(service);
    if (service) {
      setNewServiceData({
        title: service.title,
        pricePerSquareFoot: service.pricePerSquareFoot,
        image: null,
        imagePath: service.imagePath,
      });
    } else {
      setNewServiceData({ title: "", pricePerSquareFoot: "", image: null, imagePath: "" });
    }
    setShowAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setCurrentService(null);
    setNewServiceData({ title: "", pricePerSquareFoot: "", image: null, imagePath: "" });
    setError("");
  };

  const handleAddUpdateService = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newServiceData.title);
    formData.append("pricePerSquareFoot", newServiceData.pricePerSquareFoot);
    if (newServiceData.image) {
      formData.append("image", newServiceData.image);
    } else if (currentService && newServiceData.imagePath) {
      formData.append("imagePath", newServiceData.imagePath);
    }

    try {
      let response;
      if (currentService) {
        response = await axios.put(
          `http://localhost:5000/api/services/${currentService._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSuccessMessage("Service updated successfully!");
      } else {
        response = await axios.post("http://localhost:5000/api/services", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Service added successfully!");
      }
      handleCloseAddEditModal();
      fetchServices();
    } catch (err) {
      console.error("Error adding/updating service:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to add/update service.");
      } else {
        setError("Failed to add/update service: Network error.");
      }
    }
  };

  const handleOpenDeleteConfirmModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setServiceToDelete(null);
    setError("");
  };

  const handleDeleteService = async () => {
    setError("");
    setSuccessMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/services/${serviceToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("Service deleted successfully!");
      handleCloseDeleteConfirmModal();
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to delete service.");
      } else {
        setError("Failed to delete service: Network error.");
      }
    }
  };

  if (loading) {
    return (
      <div className="servicedashboard-loading">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading services...</span>
        </Spinner>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="servicedashboard-container">
      <div className="servicedashboard-header">
        <h2 className="servicedashboard-title">
          <i className="bi bi-gear-wide-connected me-3"></i>
          Service Management
        </h2>
        <div className="title-underline"></div>
        <p className="servicedashboard-subtitle">Manage your service offerings</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}
      {successMessage && <Alert variant="success" className="custom-alert">{successMessage}</Alert>}

      <button className="servicedashboard-add-btn" onClick={() => handleOpenAddEditModal()}>
        <i className="bi bi-plus-circle me-2"></i>
        Add New Service
      </button>

      {services.length > 0 ? (
        <div className="table-responsive">
          <table className="servicedashboard-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price per Sq. Ft.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="service-image">
                    {service.imagePath ? (
                      <img
                        src={`http://localhost:5000${service.imagePath}`}
                        alt={service.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/2a2a2a/ffc107?text=No'; }}
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </td>
                  <td className="service-title">{service.title}</td>
                  <td className="service-price">₹{service.pricePerSquareFoot}</td>
                  <td className="service-actions">
                    <button
                      className="action-btn action-edit"
                      onClick={() => handleOpenAddEditModal(service)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => handleOpenDeleteConfirmModal(service)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <i className="bi bi-tools display-1"></i>
          <p>No services found</p>
          <p className="text-muted small">Click "Add New Service" to get started</p>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Modal show={showAddEditModal} onHide={handleCloseAddEditModal} centered className="servicedashboard-modal">
        <Modal.Header closeButton className="servicedashboard-modal-header">
          <Modal.Title>
            {currentService ? (
              <><i className="bi bi-pencil-square me-2"></i>Edit Service</>
            ) : (
              <><i className="bi bi-plus-circle me-2"></i>Add New Service</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="servicedashboard-modal-body">
          <Form onSubmit={handleAddUpdateService}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label className="form-label">
                <i className="bi bi-tag-fill me-2"></i>
                Service Title
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newServiceData.title}
                onChange={handleInputChange}
                required
                className="servicedashboard-input"
                placeholder="Enter service title"
              />
            </Form.Group>
            <Form.Group controlId="pricePerSquareFoot" className="mb-3">
              <Form.Label className="form-label">
                <i className="bi bi-currency-rupee me-2"></i>
                Price per Sq. Ft.
              </Form.Label>
              <Form.Control
                type="number"
                name="pricePerSquareFoot"
                value={newServiceData.pricePerSquareFoot}
                onChange={handleInputChange}
                required
                className="servicedashboard-input"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label className="form-label">
                <i className="bi bi-image-fill me-2"></i>
                Service Image
              </Form.Label>
              <Form.Control 
                type="file" 
                name="image" 
                onChange={handleInputChange} 
                accept="image/*"
                className="servicedashboard-file"
              />
              {currentService && newServiceData.imagePath && (
                <div className="current-image-preview">
                  <small>Current Image:</small>
                  <img
                    src={`http://localhost:5000${newServiceData.imagePath}`}
                    alt="Current"
                  />
                  <small className="text-muted">Upload new to replace</small>
                </div>
              )}
            </Form.Group>
            <button type="submit" className="servicedashboard-submit-btn">
              <i className="bi bi-save-fill me-2"></i>
              {currentService ? "Update Service" : "Add Service"}
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirmModal} centered className="servicedashboard-modal">
        <Modal.Header closeButton className="servicedashboard-modal-header">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="servicedashboard-modal-body text-center">
          <i className="bi bi-question-circle display-1 text-warning mb-3 d-block"></i>
          <p>Are you sure you want to delete the service:</p>
          <p className="fw-bold text-gold">{serviceToDelete?.title}</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="servicedashboard-modal-footer">
          <button className="modal-btn modal-cancel" onClick={handleCloseDeleteConfirmModal}>
            <i className="bi bi-arrow-left me-2"></i>
            Cancel
          </button>
          <button className="modal-btn modal-danger" onClick={handleDeleteService}>
            <i className="bi bi-trash me-2"></i>
            Delete Service
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceDashboard;