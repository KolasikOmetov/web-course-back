const db = require('../db')

class bookController {

    async geAllBooks(req, res) {
        const result = await db.query('SELECT bookID,name_book,genre,page_count,authorID FROM book WHERE isDeleted = FALSE');
        res.json(result.rows);
    }

    async getBookInAuthors(req, res) {
        const id = req.params.AuthorID;
        const result = await db.query('SELECT bookID,name_book,genre,page_count,authorID FROM book WHERE isDeleted = FALSE AND authorID = $1', [id]);
        res.json(result.rows);
    }

    async getBook(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT bookID,name_book,genre,page_count,authorID FROM book WHERE isDeleted = FALSE AND bookID = $1', [id]);
        res.json(result.rows[0]);
    }

    async createBook(req, res) {
        const { name_book, genre, page_count, authorID } = req.body;
        const result = await db.query('INSERT INTO book(name_book, genre, page_count, authorID) VALUES ($1, $2, $3, $4) RETURNING bookID,name_book,genre,page_count,authorID', [name_book, genre, page_count, authorID]);
        res.json(result.rows[0]);  
    }

    async updateBook(req, res) {
        const {bookID, name_book, genre, page_count, authorID} = req.body;
        const result = await db.query('UPDATE book SET name_book = $1, genre = $2, page_count = $3 , authorID = $4, WHERE bookID = $5 AND isDeleted = FALSE RETURNING bookID,name_book,genre,page_count,authorID',
        [name_book, genre, page_count, authorID, bookID]);
        res.json(result.rows[0]);
    }

    async deleteBook(req, res) {
        const id = req.params.id;
        await db.query('UPDATE book SET isDeleted = TRUE WHERE bookID = $1 RETURNING bookID,name_book,genre,page_count,authorID', [id]);
        res.json('book with id: ' + id + ' was deleted');
    }
}

module.exports = new bookController();
