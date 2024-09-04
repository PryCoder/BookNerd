import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFirebase } from '../context/Firebase';
import { FaBook, FaSearch } from 'react-icons/fa';

const MyNavbar = () => {
  const { user, signOutUser } = useFirebase();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error("Error during sign-out: ", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${searchQuery}`);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <FaBook size={30} className="mb-1 me-2" />
          BookNerd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/book/list">Add Listing</Nav.Link>
                <Nav.Link href="/books/orders">Orders</Nav.Link>
                <Nav.Link href="/books/rentals">Rentals</Nav.Link>
                
                {/* Search Form for Large Screens */}
                {!showSearch ? (
                  <Button
                    variant="outline-light"
                    className="d-none d-md-flex align-items-center ms-3"
                    onClick={() => setShowSearch(true)}
                  >
                    <FaSearch />
                  </Button>
                ) : (
                  <Form className="d-none d-md-flex me-3" onSubmit={handleSearch}>
                    <Form.Control
                      type="search"
                      placeholder="Search Books"
                      className="me-2 form-control-sm"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ height: '35px' }}
                    />
                    <Button type="submit" className="btn btn-outline-light btn-sm">
                      Search
                    </Button>
                  </Form>
                )}
              </>
            ) : null}
          </Nav>
          <Nav className="ms-auto">
            {/* Search Icon Button for Small Screens */}
            {!showSearch && (
              <Button
                variant="outline-light"
                className="d-md-none me-2 mt-2"
                onClick={() => setShowSearch(true)}
              >
                <FaSearch />
              </Button>
            )}
            {showSearch && (
              <Form
                className="d-md-none position-absolute top-100 start-50 translate-middle-x"
                onSubmit={handleSearch}
                style={{ zIndex: 1000 }}
              >
                <Form.Control
                  type="search"
                  placeholder="Search Books"
                  className="me-2 form-control-sm"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ height: '35px' }}
                />
                <Button type="submit" className="btn btn-outline-light btn-sm">
                  Search
                </Button>
              </Form>
            )}
            {user ? (
              <Button variant="outline-light" onClick={handleSignOut} className="mt-2">
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline-light" onClick={handleSignIn} className="me-2 mt-2">
                  Sign In
                </Button>
                <Button variant="outline-light" onClick={handleSignUp} className="mt-2">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
};

export default MyNavbar;
