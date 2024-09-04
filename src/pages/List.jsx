import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFirebase } from "../context/Firebase";

const ListingPage = () => {
  const firebase = useFirebase();
  
  const [name, setName] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState(null); // State for preview
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    setCoverPic(file);

    // Generate a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPicPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);
      setSuccess(true);
    } catch (err) {
      setError("Failed to create listing. Please try again.");
      console.error(err);
    }
  };

  const imageStyles = {
    maxWidth: '300px',
    maxHeight: '300px',
    width: 'auto',
    height: 'auto',
    display: 'block',
    marginTop: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="container mt-5">
      {!success ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Enter Book Name</Form.Label>
            <Form.Control
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Book name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              onChange={(e) => setIsbnNumber(e.target.value)}
              value={isbnNumber}
              type="text"
              placeholder="ISBN Number"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Price</Form.Label>
            <Form.Control
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="text"
              placeholder="Enter Price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCoverPic">
            <Form.Label>Cover Pic</Form.Label>
            <Form.Control
              onChange={handleCoverPicChange}
              type="file"
            />
            {coverPicPreview && (
              <img
                src={coverPicPreview}
                alt="Cover Preview"
                style={imageStyles}
              />
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Create
          </Button>

          {error && <p className="text-danger mt-3">{error}</p>}
        </Form>
      ) : (
        <div>
          <p className="text-success">Listing created successfully!</p>
          <Button variant="primary" onClick={() => setSuccess(false)}>
            Create Another Listing
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
