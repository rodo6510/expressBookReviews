const axios = require('axios');

function getBooks() {
    axios.get('https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/axios/books')
        .then(response => {
            console.log('List of books:', response.data);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
}

function getBookDetailsISBN(isbn) {
    axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/axios/isbn/${isbn}`)
        .then(response => {
            console.log(`Details of book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

function getBookDetailsAuthor(author) {
    axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
        .then(response => {
            console.log(`Details of book with author ${author}:`, response.data);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

function getBookDetailsTitle(title) {
    axios.get(`https://robertdoerfl-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`)
        .then(response => {
            console.log(`Details of a book with Title ${title}:`, response.data);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

getBooks();
getBookDetailsISBN('978-0341091493');
getBookDetailsAuthor('balzac');
getBookDetailsTitle('Divine');