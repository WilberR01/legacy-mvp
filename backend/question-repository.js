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
            }, true); // <--- skipTransaction = true
        }
        saveNext(0);
    });
}

module.exports = { createQuestion, createQuestionsBulk };
