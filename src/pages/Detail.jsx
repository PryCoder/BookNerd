import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFirebase } from "../context/Firebase";

const BookDetailPage = () => {
  const params = useParams();
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [duration, setDuration] = useState(1);
  const [data, setData] = useState(null);
  const [url, setURL] = useState(null);

  useEffect(() => {
    firebase.getBookById(params.bookId).then((value) => setData(value.data()));
  }, [params.bookId, firebase]);

  useEffect(() => {
    if (data) {
      const imageURL = data.imageURL;
      firebase.getImageURL(imageURL).then((url) => setURL(url));
    }
  }, [data, firebase]);

  const placeOrder = async () => {
    const order = await firebase.placeOrder(params.bookId, qty);
    localStorage.setItem("lastOrder", JSON.stringify(order)); // Save order in localStorage
    navigate("/books/orders", { state: { order } }); // Navigate to orders page
  };

  const rentBook = async () => {
    const rental = await firebase.rentBook(params.bookId, qty, duration);
    navigate("/books/rentals", { state: { rental } });
  };

  if (data == null) return <h1>Loading...</h1>;

  return (
    <div className="container mt-5">
      <h1>{data.name}</h1>
      {url && (
        <img
          src={url}
          width="50%"
          style={{ borderRadius: "10px" }}
          alt={data.name}
        />
      )}
      <h1>Details</h1>
      <p>Price: Rs. {data.price}</p>
      <p>ISBN Number: {data.isbn}</p>
      <h1>Owner Details</h1>
      <p>Name: {data.displayName}</p>
      <p>Email: {data.userEmail}</p>

      <Form.Group className="mb-3" controlId="formBasicQty">
        <Form.Label>Qty</Form.Label>
        <Form.Control
          onChange={(e) => setQty(e.target.value)}
          value={qty}
          type="Number"
          placeholder="Enter Qty"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDuration">
        <Form.Label>Rental Duration (days)</Form.Label>
        <Form.Control
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
          type="Number"
          placeholder="Enter Duration in Days"
        />
      </Form.Group>

      <Button onClick={placeOrder} variant="success" className="me-2">
        Buy Now
      </Button>

      <Button onClick={rentBook} variant="primary">
        Rent Now
      </Button>
    </div>
  );
};

export default BookDetailPage;
