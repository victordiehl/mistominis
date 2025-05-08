// backend/server.js
const express = require('express');
const path    = require('path');

const app = express();

const dataDir     = path.join(__dirname, 'data');
// atualiza para onde o index.html realmente está
const frontendDir = path.join(__dirname, '../frontend/src');

// 1) JSON de produtos em /data
app.use('/data', express.static(dataDir));
// 2) arquivos estáticos do frontend em frontend/src
app.use(express.static(frontendDir));
// 3) fallback para index.html dentro de src
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
