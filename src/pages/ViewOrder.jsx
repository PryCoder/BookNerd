import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import BookCard from "../components/Card";
import Receipt from "../components/Receipt";

const OrdersPage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const location = useLocation();
  const [order, setOrder] = useState(
    location.state?.order || JSON.parse(localStorage.getItem("lastOrder"))
  );

  useEffect(() => {
    if (firebase.isLoggedIn) {
      firebase.fetchMyBooks(firebase.user.uid).then((books) => setBooks(books.docs));
    }
  }, [firebase]);

  useEffect(() => {
    if (order) {
      localStorage.setItem("lastOrder", JSON.stringify(order));
    }
  }, [order]);

  useEffect(() => {
    return () => {
      // Clear order from localStorage when the component unmounts or before navigating away
      localStorage.removeItem("lastOrder");
    };
  }, []);

  const handleDeleteReceipt = () => {
    setOrder(null);
    localStorage.removeItem("lastOrder");
  };

  if (!firebase.isLoggedIn) return <h1>Please log in</h1>;

  return (
    <div>
      {order && <Receipt order={order} onDelete={handleDeleteReceipt} />} {/* Display the receipt if order exists */}
      {books.map((book) => (
        <BookCard
          link={`/books/orders/${book.id}`}
          key={book.id}
          id={book.id}
          {...book.data()}
        />
      ))}
    </div>
  );
};

export default OrdersPage;
