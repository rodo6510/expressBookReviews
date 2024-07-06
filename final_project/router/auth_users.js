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

/*
regd_users.post("/login", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Login - "username1": ${username}, "password1": ${password}`);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  
  res.status(200).json({ message: "Login successful", token: token });

});
*/

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
regd_users.put('/auth/review/:isbn', authenticateUser, function (req, res) {
    const isbn = req.params.isbn;
    const { review } = req.body;


    const token = req.session.token;
    console.log(`Token:": ${token}`);
  
    if (!review) {
      return res.status(400).json({ message: 'Review text is required.' });
    }
  
    const book = Object.values(books).find(book => book.isbn === isbn);
  
    if (!book) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  
    // Add or update the review
    book.reviews[req.user.username] = review;
  
    res.status(200).json({ message: 'Review added/updated successfully.' });
  });
  



// Main endpoint to be accessed by authenticated users
regd_users.get("/auth/get_message", (req, res) => {
    return res.status(200).json({ message: "Hello, You are an authenticated user. Congratulations!" });
  });



  
// module.exports = regd_users;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
