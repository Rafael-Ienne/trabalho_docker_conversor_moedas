// Importa o Express, um framework web para Node.js que facilita criar rotas e servidores HTTP
const express = require('express');
// Importa o body-parser, que serve para interpretar o corpo (body) das requisições JSON. 
const bodyParser = require('body-parser');
// Importa o Mongoose, uma biblioteca que facilita a conexão e manipulação de dados no MongoDB usando modelos (schemas)
const mongoose = require('mongoose');
// Importa o CORS (Cross-Origin Resource Sharing), que permite que seu backend seja acessado por um frontend rodando em outro domínio/porta
const cors = require('cors');

// Conexão com o banco de dados
mongoose.connect('mongodb://mongo:27017/conversiondb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const app = express(); // Cria uma instância da aplicação Express
app.use(bodyParser.json()); // Configura o Express para entender requisições com corpo em JSON 
app.use(cors()); // Habilita o CORS para permitir que o frontend acesse a API, mesmo que estejam em domínios diferentes

// Define Conversion Schema and Model
const conversionSchema = new mongoose.Schema({
  valorReal: Number,
  valorDolar: Number,
  valorEuro: Number,
  valorCAD: Number
});

// Cria um modelo chamado Conversion baseado nesse schema, que representa uma coleção no banco de dados.
const Conversion = mongoose.model('Conversion', conversionSchema);

// POST /conversions - Create a new conversion
app.post('/conversions', async (req, res) => {

  const { valorReal, valorDolar, valorEuro, valorCAD } = req.body; // Extrai os valores do corpo da requisição (JSON enviado pelo cliente)

  const newConversion = new Conversion({
    valorReal,
    valorDolar,
    valorEuro,
    valorCAD
  });

  try {
    const savedConversion = await newConversion.save(); // Tenta salvar a conversão no MongoDB, de forma assíncrona usando await
    console.log(`Conversion inserted successfully: ${savedConversion}`);
    res.status(201).json(savedConversion);
  } catch (error) {
    console.error('Error inserting conversion:', error);
    res.status(500).json({ error: 'Error inserting conversion' });
  }
});

const PORT = 3000; // Define a porta onde o servidor vai rodar.

// Inicia o servidor Express e exibe uma mensagem indicando que ele está rodando
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
