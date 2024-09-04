import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';
import BookCard from '../components/Card';
import RentalReceipt from '../components/RentalReceipt';

const RentalsPage = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState(() => {
    // Load rentals from local storage if available
    const savedRentals = JSON.parse(localStorage.getItem('rentals')) || [];
    return savedRentals;
  });
  const location = useLocation();

  useEffect(() => {
    if (firebase.isLoggedIn) {
      firebase.fetchMyRentedBooks(firebase.user.uid).then((rentedBooks) => setBooks(rentedBooks));
    }
  }, [firebase]);

  useEffect(() => {
    const rental = location.state?.rental;

    if (rental) {
      // Check for uniqueness
      const rentalExists = rentals.some(r => r.id === rental.id);

      if (!rentalExists) {
        // Add rental to state and local storage
        const updatedRentals = [...rentals, rental];
        setRentals(updatedRentals);
        localStorage.setItem('rentals', JSON.stringify(updatedRentals));
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, rentals]);

  const handleDeleteReceipt = (rentalToDelete) => {
    // Update state and local storage to remove the rental
    const updatedRentals = rentals.filter(rental => rental.id !== rentalToDelete.id);
    setRentals(updatedRentals);
    localStorage.setItem('rentals', JSON.stringify(updatedRentals));
  };

  if (!firebase.isLoggedIn) return <h1>Please log in</h1>;

  return (
    <div>
      {rentals.length > 0 ? (
        rentals.map((rental) => (
          <RentalReceipt
            key={rental.id}  // Use unique ID for key
            rental={rental}
            onDelete={handleDeleteReceipt}
          />
        ))
      ) : (
        <p>No rental receipts available.</p>
      )}
      {books.map((book) => (
        // Only show BookCard if the user is the owner
        book.ownerId === firebase.user.uid && (
          <BookCard
            link={`/books/rentals/${book.bookId}`}
            key={book.bookId}
            id={book.bookId}
            {...book.bookData}
          />
        )
      ))}
    </div>
  );
};

export default RentalsPage;
