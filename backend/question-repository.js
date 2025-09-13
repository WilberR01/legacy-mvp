const db = require('./database');

function createQuestion(questionData, callback, skipTransaction = false) {
    const runInTransaction = !skipTransaction;
    const runDb = runInTransaction ? db.serialize.bind(db) : (fn) => fn();

    runDb(() => {
        if (runInTransaction) db.run('BEGIN TRANSACTION');

        const questionSql = `
            INSERT INTO Questao (DescricaoResumida, Enunciado, Dificuldade, Tipo, CategoriaID, AutorID) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const questionParams = [
            questionData.shortDescription,
            questionData.fullStatement,
            questionData.difficulty,
            questionData.type,
            questionData.categoryId || 1,
            questionData.authorId || null
        ];

        db.run(questionSql, questionParams, function(err) {
            if (err) {
                if (runInTransaction) db.run('ROLLBACK');
                return callback(err);
            }

            const questionId = this.lastID;

            if (questionData.type == 2) { // Tipo 2: Objetiva
                const alternativeSql = `INSERT INTO AlternativaQuestao (QuestaoID, TextoAlternativa, Correta) VALUES (?, ?, ?)`;
                const stmt = db.prepare(alternativeSql);
                let errorOccurred = false;

                questionData.alternatives.forEach((alt, index) => {
                    if (errorOccurred) return;
                    const isCorrect = (index === questionData.correctAlternativeIndex);
                    stmt.run(questionId, alt.text, isCorrect, (altErr) => {
                        if (altErr && !errorOccurred) {
                            errorOccurred = true;
                            if (runInTransaction) db.run('ROLLBACK');
                            callback(altErr);
                        }
                    });
                });

                stmt.finalize((finalizeErr) => {
                    if (finalizeErr && !errorOccurred) {
                        if (runInTransaction) db.run('ROLLBACK');
                        return callback(finalizeErr);
                    }
                    if (!errorOccurred) {
                        if (runInTransaction) db.run('COMMIT');
                        callback(null, { id: questionId });
                    }
                });

            } else if (questionData.type == 1) { // Tipo 1: Discursiva
                const subjectiveSql = `INSERT INTO SubjetivaQuestao (QuestaoID, RespostaEsperada) VALUES (?, ?)`;
                db.run(subjectiveSql, [questionId, questionData.expectedAnswer], (subErr) => {
                    if (subErr) {
                        if (runInTransaction) db.run('ROLLBACK');
                        return callback(subErr);
                    }
                    if (runInTransaction) db.run('COMMIT');
                    callback(null, { id: questionId });
                });
            } else {
                if (runInTransaction) db.run('ROLLBACK');
                callback(new Error("Tipo de questão inválido."));
            }
        });
    });
}

function createQuestionsBulk(questions, callback) {
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        let saved = 0;
        let errorOccurred = false;

        function saveNext(index) {
            if (errorOccurred || index >= questions.length) {
                if (!errorOccurred) {
                    db.run('COMMIT');
                    callback(null, { saved });
                }
                return;
            }
            createQuestion(questions[index], (err) => {
                if (err) {
                    errorOccurred = true;
                    db.run('ROLLBACK');
                    callback(err);
                } else {
                    saved++;
                    saveNext(index + 1);
                }
            }, true); 
        }
        saveNext(0);
    });
}

function searchQuestions(params, callback) {
    let sql = `
        SELECT
            q.QuestaoID as id,
            q.DescricaoResumida as shortDescription,
            q.Enunciado as fullStatement,
            q.Reputacao as reputation,
            q.Dificuldade as difficulty,
            q.Tipo as type,
            c.Nome as categoryName,
            u.Nome as authorName
        FROM Questao q
        LEFT JOIN Categoria c ON q.CategoriaID = c.CategoriaID
        LEFT JOIN Usuario u ON q.AutorID = u.UsuarioID
        WHERE 1=1
    `;
    const queryParams = [];

    if (params.text) {
        sql += ` AND (q.DescricaoResumida LIKE ? OR q.Enunciado LIKE ?)`;
        queryParams.push(`%${params.text}%`);
        queryParams.push(`%${params.text}%`);
    }

    if (params.categoryId) {
        sql += ` AND q.CategoriaID = ?`;
        queryParams.push(params.categoryId);
    }

    if (params.reputation && parseInt(params.reputation, 10) > 0) {
        sql += ` AND q.Reputacao >= ?`;
        queryParams.push(params.reputation);
    }

    sql += ` ORDER BY q.DataCriacao DESC`;

    db.all(sql, queryParams, (err, rows) => {
        callback(err, rows);
    });
}

function dynamicSearch(params, callback) {
    let sql = `
        SELECT
            q.QuestaoID as id,
            q.DescricaoResumida as shortDescription,
            q.Enunciado as fullStatement,
            q.Reputacao as reputation,
            q.Dificuldade as difficulty,
            q.Tipo as type,
            c.Nome as categoryName,
            u.Nome as authorName
        FROM Questao q
        LEFT JOIN Categoria c ON q.CategoriaID = c.CategoriaID
        LEFT JOIN Usuario u ON q.AutorID = u.UsuarioID
        WHERE 1=1
    `;
    const queryParams = [];

    if (params.categories && params.categories.length > 0) {
        sql += ` AND q.CategoriaID IN (${params.categories.map(() => '?').join(',')})`;
        queryParams.push(...params.categories);
    }

    if (params.types && params.types.length > 0) {
        sql += ` AND q.Tipo IN (${params.types.map(() => '?').join(',')})`;
        queryParams.push(...params.types);
    }
    
    sql += ` AND q.Dificuldade BETWEEN ? AND ?`;
    queryParams.push(params.minDifficulty, params.maxDifficulty);

    sql += ` AND q.Reputacao BETWEEN ? AND ?`;
    queryParams.push(params.minReputation, params.maxReputation);

    sql += ` ORDER BY RANDOM() LIMIT ?`;
    queryParams.push(params.quantity);

    db.all(sql, queryParams, (err, rows) => {
        callback(err, rows);
    });
}


module.exports = { 
    createQuestion, 
    createQuestionsBulk, 
    searchQuestions, 
    dynamicSearch 
};

