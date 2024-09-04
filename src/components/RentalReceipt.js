import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import { Modal, Button } from 'react-bootstrap'; // Import modal components
import { format } from 'date-fns'; // Import date-fns for date formatting

const RentalReceipt = ({ rental, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    onDelete(rental);
    setShowModal(false);
  };

  // Safely handle rentalDate
  let rentalDate = rental.rentalDate;
  if (rentalDate && rentalDate.toDate) {
    rentalDate = rentalDate.toDate(); // Convert Firestore Timestamp to JavaScript Date
  } else if (typeof rentalDate === 'string') {
    rentalDate = new Date(rentalDate); // Convert string to Date
  } else if (!(rentalDate instanceof Date)) {
    rentalDate = null;
  }
  
  const formattedRentalDate = rentalDate ? format(new Date(rentalDate), 'MMMM dd, yyyy') : 'Date not available';

  // Calculate the return date
  const rentalDuration = rental.duration || 0; // Duration in days
  const returnDate = rentalDate ? new Date(rentalDate.getTime() + rentalDuration * 24 * 60 * 60 * 1000) : null;
  const formattedReturnDate = returnDate ? format(new Date(returnDate), 'MMMM dd, yyyy') : 'Return date not available';

  return (
    <Card style={{ width: '18rem', margin: '25px', position: 'relative' }}>
      <Card.Body>
        <Card.Title>
          Rental Receipt
          <FaTrash
            style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          />
        </Card.Title>
        <Card.Text>
          <strong>Book ID:</strong> {rental.bookId || 'N/A'} <br />
          <strong>Quantity:</strong> {rental.qty || 'N/A'} <br />
          <strong>User Name:</strong> {rental.displayName || 'N/A'} <br />
          <strong>User Email:</strong> {rental.userEmail || 'N/A'} <br />
          <strong>Rental Date:</strong> {formattedRentalDate} <br />
          <strong>Rental Duration:</strong> {rental.duration || 'N/A'} days <br />
          <strong>Return Date:</strong> {formattedReturnDate}
        </Card.Text>
      </Card.Body>

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this rental receipt?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default RentalReceipt;
