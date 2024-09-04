import React, { useEffect, useState } from "react";
import { Row, Col, Container, Card, Button } from "react-bootstrap"; // Import Card and Button
import { useFirebase } from "../context/Firebase";
import BookCard from "../components/Card";
import { FaBook, FaShoppingCart, FaUserCheck } from "react-icons/fa"; // Import icons
import { useLocation } from "react-router-dom"; // Import useLocation to get query parameters

const HomePage = () => {
  const { user, listAllBooks } = useFirebase();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const location = useLocation(); // Use useLocation to get the search query from the URL

  useEffect(() => {
    if (user) {
      listAllBooks().then((books) => {
        const allBooks = books.docs;
        setBooks(allBooks);
        setFilteredBooks(allBooks); // Set all books as initial filtered books
      });
    }
  }, [user, listAllBooks]);

  // Function to filter books based on the search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || ""; // Get the 'q' query parameter

    if (query) {
      const filtered = books.filter((book) =>
        book.data().name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books); // If no search query, show all books
    }
  }, [location.search, books]);

  return (
    <div style={user ? loggedInPageStyles : notLoggedInPageStyles}>
      <Container className={user ? "mt-5" : "py-5"}>
        {user ? (
          // Show the list of filtered books if the user is logged in
          <Row>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Col xs={12} sm={6} md={4} lg={4} key={book.id} className="mb-4">
                  <BookCard
                    link={`/book/view/${book.id}`}
                    id={book.id}
                    {...book.data()}
                  />
                </Col>
              ))
            ) : (
              <p className="text-white">No books found for your search query.</p>
            )}
          </Row>
        ) : (
          // Show the introductory content if the user is not logged in
          <>
            <Row className="mb-5">
              <Col md={12}>
                <div style={overlayStyles}>
                  <h1 style={headingStyles}>Welcome to BookNerd!</h1>
                  <p style={paragraphStyles}>
                    Your one-stop destination for buying and renting books.
                    Discover a world of knowledge and adventure with our curated
                    collection of books across every genre. Whether you're a
                    casual reader or a bibliophile, BookNerd offers an unmatched
                    experience tailored just for you.
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-4">
                <Card style={cardStyles} className="p-3">
                  <Card.Body>
                    <FaBook size={50} className="mb-3 text-warning" />
                    <Card.Title>Wide Selection of Books</Card.Title>
                    <Card.Text>
                      Explore our vast collection of books across various genres.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card style={cardStyles} className="p-3">
                  <Card.Body>
                    <FaShoppingCart size={50} className="mb-3 text-warning" />
                    <Card.Title>Easy Purchases</Card.Title>
                    <Card.Text>
                      Seamlessly buy or rent books with just a few clicks.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card style={cardStyles} className="p-3">
                  <Card.Body>
                    <FaUserCheck size={50} className="mb-3 text-warning" />
                    <Card.Title>Join Us Today</Card.Title>
                    <Card.Text>
                      Sign up to unlock exclusive features and deals.
                    </Card.Text>
                    <Button variant="primary" href="/register">
                      Sign Up
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

// Styles can remain the same as your original implementation
const loggedInPageStyles = {
  backgroundImage: 'url("https://www.londonlibrary.co.uk/images/CHARLOTTE/NEW_WEBSITE_IMAGES/artforinside.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  color: 'white',
  paddingTop: '50px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const notLoggedInPageStyles = {
  backgroundImage: 'url("https://im.whatshot.in/img/2019/Dec/leaping-windows1-1576236885.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  color: 'white',
  paddingTop: '50px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const overlayStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '40px',
  borderRadius: '15px',
  maxWidth: '800px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
  margin: 'auto',
  zIndex: 10,
};

const headingStyles = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#FFD700',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
};

const paragraphStyles = {
  fontSize: '1.2rem',
  lineHeight: '1.5',
  color: '#f8f9fa',
};

const cardStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  border: 'none',
  color: 'white',
  height: '100%',
};

export default HomePage;
