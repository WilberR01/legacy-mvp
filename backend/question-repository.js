const db = require('./database');

function createQuestion(questionData, callback) {
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

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
                db.run('ROLLBACK');
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
                            db.run('ROLLBACK');
                            callback(altErr);
                        }
                    });
                });

                stmt.finalize((finalizeErr) => {
                    if (finalizeErr && !errorOccurred) {
                        db.run('ROLLBACK');
                        return callback(finalizeErr);
                    }
                    if (!errorOccurred) {
                        db.run('COMMIT');
                        callback(null, { id: questionId });
                    }
                });

            } else if (questionData.type == 1) { // Tipo 1: Discursiva
                const subjectiveSql = `INSERT INTO SubjetivaQuestao (QuestaoID, RespostaEsperada) VALUES (?, ?)`;
                db.run(subjectiveSql, [questionId, questionData.expectedAnswer], (subErr) => {
                    if (subErr) {
                        db.run('ROLLBACK');
                        return callback(subErr);
                    }
                    db.run('COMMIT');
                    callback(null, { id: questionId });
                });
            } else {
                db.run('ROLLBACK');
                callback(new Error("Tipo de questão inválido."));
            }
        });
    });
}

module.exports = { createQuestion };
