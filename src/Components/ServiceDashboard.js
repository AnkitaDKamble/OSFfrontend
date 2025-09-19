import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentService, setCurrentService] = useState(null); // For editing
  const [newServiceData, setNewServiceData] = useState({
    title: "",
    pricePerSquareFoot: "",
    image: null, // For file input
    imagePath: "", // For displaying existing image path
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Function to fetch services
  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      // The GET /api/services route is publicly accessible, no token strictly needed
      // for fetching, but it doesn't hurt if an admin token is present.
      const token = localStorage.getItem("token"); 
      const response = await axios.get("http://localhost:5000/api/services", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }), // Only add if token exists
        },
      });

      // --- CRUCIAL FIX: Access response.data.services ---
      if (response.data && Array.isArray(response.data.services)) {
        setServices(response.data.services);
      } else {
        console.error("Unexpected data structure for services:", response.data);
        setError("Failed to load services: Unexpected data format from server.");
        setServices([]); // Ensure it's an empty array to prevent map error
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to load services.");
      } else {
        setError("Failed to load services: Network error or backend not reachable.");
      }
      setServices([]); // Ensure it's an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle input changes for add/edit form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewServiceData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Handle file input separately
    }));
  };

  // Open Add/Edit Modal
  const handleOpenAddEditModal = (service = null) => {
    setError("");
    setSuccessMessage("");
    setCurrentService(service);
    if (service) {
      setNewServiceData({
        title: service.title,
        pricePerSquareFoot: service.pricePerSquareFoot,
        image: null, // Don't pre-fill file input
        imagePath: service.imagePath, // Keep track of existing image path
      });
    } else {
      setNewServiceData({ title: "", pricePerSquareFoot: "", image: null, imagePath: "" });
    }
    setShowAddEditModal(true);
  };

  // Close Add/Edit Modal
  const handleCloseAddEditModal = () => {
    setShowAddEditModal(false);
    setCurrentService(null);
    setNewServiceData({ title: "", pricePerSquareFoot: "", image: null, imagePath: "" });
    setError("");
  };

  // Handle Add/Update Service Submission
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
      formData.append("image", newServiceData.image); // Append file if present
    } else if (currentService && newServiceData.imagePath) {
      // If no new image, but editing an existing service, send the existing imagePath
      formData.append("imagePath", newServiceData.imagePath);
    }

    try {
      let response;
      if (currentService) {
        // Update existing service
        response = await axios.put(
          `http://localhost:5000/api/services/${currentService._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );
        setSuccessMessage("Service updated successfully!");
      } else {
        // Add new service
        response = await axios.post("http://localhost:5000/api/services", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        });
        setSuccessMessage("Service added successfully!");
      }
      handleCloseAddEditModal();
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error("Error adding/updating service:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to add/update service.");
      } else {
        setError("Failed to add/update service: Network error.");
      }
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteConfirmModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirmModal(true);
  };

  // Close Delete Confirmation Modal
  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setServiceToDelete(null);
    setError("");
  };

  // Handle Delete Service
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
      fetchServices(); // Refresh the list
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
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading services...</span>
        </Spinner>
        <p className="mt-2">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Service Management (Admin)</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Button variant="success" className="mb-3" onClick={() => handleOpenAddEditModal()}>
        Add New Service
      </Button>

      {services.length > 0 ? (
        <Table striped bordered hover responsive>
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
                <td>
                  {service.imagePath ? (
                    <img
                      src={`http://localhost:5000${service.imagePath}`}
                      alt={service.title}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50?text=No'; }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{service.title}</td>
                <td>₹{service.pricePerSquareFoot}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleOpenAddEditModal(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDeleteConfirmModal(service)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info" className="text-center">No services found. Add a new service!</Alert>
      )}


      {/* Add/Edit Service Modal */}
      <Modal show={showAddEditModal} onHide={handleCloseAddEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentService ? "Edit Service" : "Add New Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUpdateService}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newServiceData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="pricePerSquareFoot" className="mb-3">
              <Form.Label>Price per Sq. Ft.</Form.Label>
              <Form.Control
                type="number"
                name="pricePerSquareFoot"
                value={newServiceData.pricePerSquareFoot}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Service Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleInputChange} accept="image/*" />
              {currentService && newServiceData.imagePath && (
                <small className="text-muted mt-2 d-block">
                  Current Image: <a href={`http://localhost:5000${newServiceData.imagePath}`} target="_blank" rel="noopener noreferrer">View</a> (Upload new to replace)
                  <img
                    src={`http://localhost:5000${newServiceData.imagePath}`}
                    alt="Current"
                    style={{ width: "80px", height: "80px", objectFit: "cover", marginLeft: "10px", borderRadius: "5px" }}
                  />
                </small>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentService ? "Update Service" : "Add Service"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the service: <strong>{serviceToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteService}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceDashboard;
