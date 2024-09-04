import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Create a Firebase context
const FirebaseContext = createContext(null);

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null); // State to store the last order

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getRedirectResult(firebaseAuth)
      .then((result) => {
        if (result) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error handling redirect:", error);
      });
  }, []);

  const signupUserWithEmailAndPassword = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with the name
      await updateProfile(user, { displayName: name });

      return userCredential;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const signInUserWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signInWithGoogle = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile
      ? signInWithRedirect(firebaseAuth, googleProvider)
      : signInWithPopup(firebaseAuth, googleProvider);
  };

  const handleCreateNewListing = async (name, isbn, price, cover) => {
    const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`);
    const uploadResult = await uploadBytes(imageRef, cover);
    return await addDoc(collection(firestore, "books"), {
      name,
      isbn,
      price,
      imageURL: uploadResult.ref.fullPath,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  };

  const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
  };

  const getBookById = async (id) => {
    const docRef = doc(firestore, "books", id);
    const result = await getDoc(docRef);
    return result;
  };

  const getImageURL = (path) => {
    return getDownloadURL(ref(storage, path));
  };

  const placeOrder = async (bookId, qty) => {
    const collectionRef = collection(firestore, "books", bookId, "orders");
    const order = {
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      qty: Number(qty),
    };
    const result = await addDoc(collectionRef, order);
    setOrder({ id: result.id, bookId, ...order }); // Set order in context
    return { id: result.id, bookId, ...order };
  };

  const rentBook = async (bookId, qty, duration) => {
    const rental = {
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      qty: Number(qty),
      duration: Number(duration),
      rentalDate: new Date(),
    };
    const result = await addDoc(
      collection(firestore, "books", bookId, "rentals"),
      rental
    );
    return { id: result.id, bookId, ...rental };
  };

  const fetchMyBooks = async (userId) => {
    const collectionRef = collection(firestore, "books");
    const q = query(collectionRef, where("userID", "==", userId));
    const result = await getDocs(q);
    return result;
  };

  const fetchMyRentedBooks = async (userId) => {
    const booksRef = collection(firestore, "books");
    const booksSnapshot = await getDocs(booksRef);

    let rentedBooks = [];

    for (let bookDoc of booksSnapshot.docs) {
      const rentalsRef = collection(
        firestore,
        "books",
        bookDoc.id,
        "rentals"
      );
      const q = query(rentalsRef, where("userID", "==", userId));
      const rentalsSnapshot = await getDocs(q);

      if (!rentalsSnapshot.empty) {
        rentedBooks.push({
          bookId: bookDoc.id,
          bookData: bookDoc.data(),
          rentals: rentalsSnapshot.docs.map((doc) => doc.data()),
        });
      }
    }

    return rentedBooks;
  };

  const getOrders = async (bookId) => {
    const collectionRef = collection(firestore, "books", bookId, "orders");
    const result = await getDocs(collectionRef);
    return result;
  };

  const getRentals = async (bookId) => {
    const rentalsRef = collection(firestore, "books", bookId, "rentals");
    const snapshot = await getDocs(rentalsRef);
    return snapshot.docs.map((doc) => doc.data());
  };

  const clearUserData = () => {
    localStorage.removeItem("user");
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/=.*$/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");
    });
  };

  const signOutUser = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      clearUserData();
    } catch (error) {
      console.error("Error during sign-out: ", error);
    }
  };

  const isLoggedIn = !!user;

  return (
    <FirebaseContext.Provider
      value={{
        signInWithGoogle,
        signupUserWithEmailAndPassword,
        signInUserWithEmailAndPassword,
        handleCreateNewListing,
        listAllBooks,
        getImageURL,
        getBookById,
        placeOrder,
        rentBook,
        fetchMyBooks,
        fetchMyRentedBooks,
        getOrders,
        getRentals,
        isLoggedIn,
        user,
        signOutUser,
        clearUserData,
        order, // Expose order state
        setOrder, // Expose function to set order state
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
