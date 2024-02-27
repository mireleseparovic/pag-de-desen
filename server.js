const express = require('express');
const app = express();
const cors = require('cors'); 

const port = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');

// Configuração ddo CORS
app.use(cors()){
 origin: 'https://cam-para-desen.vercel.app',
}));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Rota para lidar com o upload de imagens
app.post('/', upload.single('image'), (req, res) => {
  try {
    // Acesso à imagem enviada
    const imageUrl = req.file.path; 
    
    // Lógica adicional, como salvar o nome da imagem no banco de dados ou responder ao cliente
    res.json({ imageUrl });
  } catch (error) {
    console.error('Erro ao processar o upload da imagem:', error);
    res.status(500).json({ error: 'Erro ao processar o upload da imagem' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
