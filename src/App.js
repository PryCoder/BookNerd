// src/App.js

import { Routes, Route } from "react-router-dom";
import MyNavbar from "./components/Navbar";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ListingPage from "./pages/List";
import HomePage from "./pages/Home";
import BookDetailPage from "./pages/Detail";
import OrdersPage from "./pages/ViewOrder";

import ViewOrderDetails from "./pages/ViewOrderDetail";
import RentalsPage from "./pages/RentalsPage"; // Added
import ViewRentalDetails from "./pages/ViewRentalDetails"; // Added
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/book/list" element={<ListingPage />} />
        <Route path="/book/view/:bookId" element={<BookDetailPage />} />
        <Route path="/books/orders" element={<OrdersPage />} />
        <Route path="/books/orders/:bookId" element={<ViewOrderDetails />} />
        <Route path="/books/rentals" element={<RentalsPage />} /> {/* Added */}
        <Route path="/books/rentals/:bookId" element={<ViewRentalDetails />} /> {/* Added */}
      </Routes>
    </div>
  );
}

export default App;
