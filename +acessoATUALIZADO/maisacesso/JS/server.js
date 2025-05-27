const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Conexão com o banco
const db = new sqlite3.Database('./locais.db');

// Criação da tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS locais (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  comentario TEXT NOT NULL,
  avaliacao INTEGER NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
)`);

// Rota para obter todos os locais
app.get('/locais', (req, res) => {
  db.all('SELECT * FROM locais', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Rota para adicionar um local
app.post('/locais', (req, res) => {
  const { nome, tipo, comentario, avaliacao, latitude, longitude } = req.body;
  db.run(
    'INSERT INTO locais (nome, tipo, comentario, avaliacao, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, tipo, comentario, avaliacao, latitude, longitude],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});