import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useFirebase } from "../context/Firebase";

const BookCard = (props) => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [url, setURL] = useState(null);

  useEffect(() => {
    if (props.imageURL) {
      firebase.getImageURL(props.imageURL).then((url) => setURL(url));
    }
  }, [props.imageURL, firebase]);

  return (
    <Card style={{ width: "18rem", margin: "25px" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={url}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          This book has a title {props.name} and is sold by {props.displayName}. This book costs Rs.{props.price}
        </Card.Text>
        <Button onClick={() => navigate(props.link)} variant="primary">
          View
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
