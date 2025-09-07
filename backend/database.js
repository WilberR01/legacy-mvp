const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'Data');
const dbFilePath = path.join(dbPath, 'questbank.db');

if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        const createUsuarioTable = `
            CREATE TABLE IF NOT EXISTS Usuario (
                UsuarioID INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(255) NOT NULL,
                Email VARCHAR(255) UNIQUE NOT NULL,
                SenhaHash VARCHAR(255) NOT NULL,
                DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createCategoriaTable = `
            CREATE TABLE IF NOT EXISTS Categoria (
                CategoriaID INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(150) NOT NULL UNIQUE,
                Descricao TEXT
            )
        `;

        const createQuestaoTable = `
            CREATE TABLE IF NOT EXISTS Questao (
                QuestaoID INTEGER PRIMARY KEY AUTOINCREMENT,
                DescricaoResumida VARCHAR(255) NOT NULL,
                Enunciado TEXT NOT NULL,
                Reputacao INTEGER DEFAULT 0,
                Dificuldade INTEGER DEFAULT 0,
                Tipo INTEGER NOT NULL,
                AutorID INTEGER,
                CategoriaID INTEGER NOT NULL,
                DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (AutorID) REFERENCES Usuario (UsuarioID),
                FOREIGN KEY (CategoriaID) REFERENCES Categoria (CategoriaID)
            )
        `;

        const createAlternativaQuestaoTable = `
            CREATE TABLE IF NOT EXISTS AlternativaQuestao (
                AlternativaID INTEGER PRIMARY KEY AUTOINCREMENT,
                QuestaoID INTEGER NOT NULL,
                TextoAlternativa TEXT NOT NULL,
                Correta BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (QuestaoID) REFERENCES Questao (QuestaoID) ON DELETE CASCADE
            )
        `;

        const createSubjetivaQuestaoTable = `
            CREATE TABLE IF NOT EXISTS SubjetivaQuestao (
                SubjetivaID INTEGER PRIMARY KEY AUTOINCREMENT,
                QuestaoID INTEGER NOT NULL UNIQUE,
                RespostaEsperada TEXT NOT NULL,
                FOREIGN KEY (QuestaoID) REFERENCES Questao (QuestaoID) ON DELETE CASCADE
            )
        `;

        db.run(createUsuarioTable, (err) => {
            if (err) console.error("Erro ao criar tabela Usuario:", err.message);
        });

        db.run(createCategoriaTable, (err) => {
            if (err) console.error("Erro ao criar tabela Categoria:", err.message);
        });

        db.run(createQuestaoTable, (err) => {
            if (err) console.error("Erro ao criar tabela Questao:", err.message);
        });
        
        db.run(createAlternativaQuestaoTable, (err) => {
            if (err) console.error("Erro ao criar tabela AlternativaQuestao:", err.message);
        });

        db.run(createSubjetivaQuestaoTable, (err) => {
            if (err) console.error("Erro ao criar tabela SubjetivaQuestao:", err.message);
        });
    });
}

module.exports = db;