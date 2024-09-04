import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFirebase } from "../context/Firebase";

const LoginPage = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await firebase.signInUserWithEmailAndPassword(email, password);
      console.log("Successfully logged in", result);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
      console.error("Login error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await firebase.signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
      console.error("Google sign-in error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        {error && <p className="mt-3 text-danger">{error}</p>}
      </Form>

      <h1 className="mt-5 mb-5">OR</h1>
      <Button onClick={handleGoogleSignIn} variant="danger" disabled={loading}>
        {loading ? "Signing in with Google..." : "Sign in with Google"}
      </Button>
    </div>
  );
};

export default LoginPage;
