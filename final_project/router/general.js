const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const SECRET_KEY = "secret42";

public_users.post("/register", (req, res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Register - "username": ${username}, "password": ${password}`);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and/or password are missing.' });
  }

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    const formattedBooks = JSON.stringify(books, null, 2); 
    res.status(200).send(formattedBooks); 

});

// axios -- book list

public_users.get('/axios/books', async (req, res) => {
    try {
        const response = await axios.get('https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// axios -- book details based on ISBN

public_users.get('/axios/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details', error: error.message });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Iterate over the books to find the one with the matching ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);
  
  if (book) {
    const formattedBook = JSON.stringify(book, null, 2); // Format the JSON response
    res.status(200).send(formattedBook); // Send the formatted JSON response
  } else {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

// axios -- book details based on Author

public_users.get('/axios/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by author', error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  // Filter books to find all that match the given author
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author));

  if (matchingBooks.length > 0) {
    // res.status(200).json(matchingBooks);
    const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Format the JSON response
    res.status(200).send(formattedBooks); // Sends the formatted JSON response

  } else {
    res.status(404).json({ message: `Books by author ${author} not found.` });
  }

});

// axios -- book details based on Title

public_users.get('/axios/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by title', error: error.message });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  // Filter books to find the one that matches the given title
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

  if (matchingBooks.length > 0) {
    const formattedBooks = JSON.stringify(matchingBooks, null, 2); // Format the JSON response
    res.status(200).send(formattedBooks); // Send the formatted JSON response
  } else {
    res.status(404).json({ message: `Books with title ${title} not found.` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  // Find the book with the given ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);
  
  if (book) {
    const formattedReviews = JSON.stringify(book.reviews, null, 2); // Format the JSON response
    res.status(200).send(formattedReviews); // Send the formatted JSON response
  } else {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});



module.exports.general = public_users;
