const db = require('./database.js');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const authRepository = {
    createUser: (user, callback) => {
        const { nome, email, senha } = user;
        bcrypt.hash(senha, saltRounds, (err, hash) => {
            if (err) {
                return callback(err);
            }
            const sql = `INSERT INTO Usuario (Nome, Email, SenhaHash) VALUES (?, ?, ?)`;
            db.run(sql, [nome, email, hash], function(err) {
                callback(err, { id: this.lastID });
            });
        });
    },

    findUserByEmail: (email, callback) => {
        const sql = `SELECT * FROM Usuario WHERE Email = ?`;
        db.get(sql, [email], (err, user) => {
            callback(err, user);
        });
    },

    verifyPassword: (plainPassword, hashedPassword, callback) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            callback(err, result);
        });
    }
};

module.exports = authRepository;