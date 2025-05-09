// backend/server.js

const express = require('express');
const path    = require('path');

const app = express();

// 1) Diretórios
const dataDir     = path.join(__dirname, 'data');
const frontendDir = path.join(__dirname, '../frontend/src');

// 2) Rota estática para o JSON de produtos (e outros arquivos em backend/data)
app.use('/data', express.static(dataDir));

// 3) Serve todo o conteúdo estático do frontend (HTML, CSS, JS, imagens…)
app.use(express.static(frontendDir));

// 4) Fallback: para qualquer GET que aceite HTML, retorna o index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    next();
  }
});

// 5) Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});