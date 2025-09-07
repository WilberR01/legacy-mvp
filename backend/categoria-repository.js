const db = require('./database');

function getAllCategories(callback) {
    const sql = `SELECT CategoriaID as id, Nome as name, Descricao as description FROM Categoria ORDER BY Nome`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function createCategory(category, callback) {
    const sql = `INSERT INTO Categoria (Nome, Descricao) VALUES (?, ?)`;
    db.run(sql, [category.name, category.description], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, ...category });
    });
}

function updateCategory(id, category, callback) {
    const sql = `UPDATE Categoria SET Nome = ?, Descricao = ? WHERE CategoriaID = ?`;
    db.run(sql, [category.name, category.description, id], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id, ...category });
    });
}

module.exports = { getAllCategories, createCategory, updateCategory };