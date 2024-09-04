import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { FaTrash } from "react-icons/fa"; // Import the trash icon
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Receipt = ({ order, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowModal(false);
  };

  return (
    <>
      <Card style={{ width: "18rem", margin: "25px", position: "relative" }}>
        <Card.Body>
          <Card.Title>
            Order Receipt
            <FaTrash
              style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px", color: "red" }}
              onClick={() => setShowModal(true)}
            />
          </Card.Title>
          <Card.Text>
            <strong>Book ID:</strong> {order.bookId || "N/A"} <br />
            <strong>Quantity:</strong> {order.qty || "N/A"} <br />
            <strong>User Name:</strong> {order.displayName || "N/A"} <br />
            <strong>User Email:</strong> {order.userEmail || "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this receipt?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Receipt;
