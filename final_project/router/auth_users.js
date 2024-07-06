const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "secret42";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
     });
     return userswithsamename.length > 0;
}

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    
    console.log(`Token:": ${token}`);
  
    if (!token) {
      console.error('No token provided.');
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.error('Invalid token format.');
      return res.status(400).json({ message: 'Invalid token format.' });
    }
  
    jwt.verify(tokenParts[1], SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error('Failed to authenticate token:', err);
        return res.status(500).json({ message: 'Failed to authenticate token.' });
      }
  
      req.user = decoded;
      next();
    });
  };

// Dummy login route to set token in session

regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

    if (user) {
      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      req.session.token = token;
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });



// Add or modify a book review
regd_users.post('/auth/review/:isbn', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token not provided or invalid' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
        } else {
            const { username } = decoded;
            const { review } = req.body;
            const isbn = req.params.isbn;

            // Finde das Buch anhand der ISBN
            const book = Object.values(books).find(book => book.isbn === isbn);

            if (!book) {
                return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
            }

            if (typeof book.reviews !== 'object') {
                book.reviews = {};
            }

            const reviewId = Object.keys(book.reviews).length + 1;
            book.reviews[reviewId] = { username, review };

            res.status(201).json({ success: true, message: `${username} successfully added/modified a Review` });
        }
    });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token not provided or invalid' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
        } else {
            const { username } = decoded;
            const isbn = req.params.isbn;

            // Finde das Buch anhand der ISBN
            const book = Object.values(books).find(book => book.isbn === isbn);

            if (!book) {
                return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
            }

            if (typeof book.reviews !== 'object') {
                return res.status(404).json({ message: 'No reviews found for this book.' });
            }

            let reviewDeleted = false;
            for (let reviewId in book.reviews) {
                if (book.reviews[reviewId].username === username) {
                    delete book.reviews[reviewId];
                    reviewDeleted = true;
                    break;
                }
            }

            if (reviewDeleted) {
                res.status(200).json({ success: true, message: `${username} successfully deleted a Review successfully` });
            } else {
                res.status(403).json({ message: 'Review not found or you are not authorized to delete this review.' });
            }
        }
    });
});


// Main endpoint to be accessed by authenticated users
regd_users.get("/auth/get_message", (req, res) => {
    return res.status(200).json({ message: "Hello, You are an authenticated user. Congratulations!" });
  });



  
// module.exports = regd_users;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
