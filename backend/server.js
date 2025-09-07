const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth-routes');
const questionRoutes = require('./question-routes');
const categoriaRoutes = require('./categoria-routes');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', questionRoutes);
app.use('/api', categoriaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});