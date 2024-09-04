import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/Firebase";

const ViewRentalDetails = () => {
  const params = useParams();
  const firebase = useFirebase();

  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    firebase.getRentals(params.bookId).then((rentals) => {
      // If rentals is a QuerySnapshot
      if (rentals.docs) {
        setRentals(rentals.docs);
      } else {
        // If rentals is an array
        setRentals(rentals);
      }
    });
  }, [params.bookId, firebase]);

  return (
    <div className="container mt-3">
      <h1>Rentals</h1>
      {rentals.map((rental) => {
        const data = rental.data ? rental.data() : rental; // Check if rental has a data method
        return (
          <div
            key={rental.id}
            className="mt-5"
            style={{ border: "1px solid", padding: "10px" }}
          >
            <h5>Rented By: {data.displayName}</h5>
            <h6>Qty: {data.qty}</h6>
            <p>Email: {data.userEmail}</p>
            <p>Rental Date: {data.rentalDate?.toDate().toLocaleDateString()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ViewRentalDetails;
