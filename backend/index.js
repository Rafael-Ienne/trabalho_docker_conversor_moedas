// Importa o Express, um framework web para Node.js que facilita criar rotas e servidores HTTP
const express = require('express');
// Importa o body-parser, que serve para interpretar o corpo (body) das requisições JSON
const bodyParser = require('body-parser');
// Importa o Mongoose, uma biblioteca que facilita a conexão e manipulação de dados no MongoDB usando modelos (schemas)
const mongoose = require('mongoose');
// Importa o CORS (Cross-Origin Resource Sharing), que permite que seu backend seja acessado por um frontend rodando em outro domínio/porta
const cors = require('cors');
// Biblioteca para fazer requisições HTTP
const axios = require('axios'); 

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
app.use('/imagens', express.static(__dirname + '/imagens')); // Permite usar as imagens do frontend

// Define Conversion Schema and Model
const conversionSchema = new mongoose.Schema({
  valorReal: Number,
  valorUSD: Number,
  valorEUR: Number,
  valorCAD: Number,
  valorJPY: Number,
  valorCNY: Number,
  valorGBP: Number,
  valorCHF: Number,
  valorTHB: Number,
  valorAUD: Number,
  valorINR: Number
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Cria um modelo chamado Conversion baseado nesse schema, que representa uma coleção no banco de dados
const Conversion = mongoose.model('Conversion', conversionSchema);

// Consulta de API de cotações de moedas 
async function buscarCotacao(moeda) {
  try {
    const response = await axios.get(`https://economia.awesomeapi.com.br/last/${moeda}-BRL?token=6d763cda52170852565013118c55406a284d7f877c026086cbb973d4df72919d`);
    return parseFloat(response.data[`${moeda}BRL`].bid);
  } catch (error) {
    console.error(`Erro ao buscar cotação de ${moeda}:`, error.message);
    throw error;
  }
}

// Promises são usadas para representar operações assíncronas, ou seja:
// - o código não para e espera a Promise terminar;
// - outras instruções podem continuar executando normalmente enquanto a Promise é processada em segundo plano.
function converterReal(valorReal, cotacaoMoeda) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(valorReal / cotacaoMoeda);
    }, 500); //Delay
  });
}

// Rota para POST /conversions
app.post('/conversions', async (req, res) => {

  const { valorReal } = req.body;

  try {
    // Cotações dinâmicas
    const [
      USD, EUR, CAD, JPY,
      CNY, GBP, CHF, THB,
      AUD, INR
    ] = await Promise.all([
      buscarCotacao('USD'),
      buscarCotacao('EUR'),
      buscarCotacao('CAD'),
      buscarCotacao('JPY'),
      buscarCotacao('CNY'),
      buscarCotacao('GBP'),
      buscarCotacao('CHF'),
      buscarCotacao('THB'),
      buscarCotacao('AUD'),
      buscarCotacao('INR'),
    ]);

    // Operações de conversão
    try {

        const startTime = Date.now();

        // Converte os valores com base nas cotações (processamento paralelo) 
        const [valorUSD, valorEUR, valorCAD, valorJPY, valorCNY, valorGBP, valorCHF, valorTHB, valorAUD, valorINR] = await Promise.all([
            converterReal(valorReal, USD), //Conversão para Dólar Americano
            converterReal(valorReal, EUR), // Conversão para Euro
            converterReal(valorReal, CAD), // Conversão para Dólar Canadense
            converterReal(valorReal, JPY), // Conversão para Yen
            converterReal(valorReal, CNY), // Conversão para Yuan
            converterReal(valorReal, GBP), // Conversão para Libra Esterlina
            converterReal(valorReal, CHF), // Conversão para Franco Suiço
            converterReal(valorReal, THB), // Conversão para Baht
            converterReal(valorReal, AUD), // Conversão para Dólar Australiano
            converterReal(valorReal, INR)  // Conversão para Rupia
        ])

        /* Converte os valores com base nas cotações (processamento sequencial)
        const valorUSD = await converterReal(valorReal, USD);
        const valorEUR = await converterReal(valorReal, EUR); 
        const valorCAD = await converterReal(valorReal, CAD); 
        const valorJPY = await converterReal(valorReal, JPY);
        const valorCNY = await converterReal(valorReal, CNY);
        const valorGBP = await converterReal(valorReal, GBP); 
        const valorCHF = await converterReal(valorReal, CHF);
        const valorTHB = await converterReal(valorReal, THB);
        const valorAUD = await converterReal(valorReal, AUD);
        const valorINR = await converterReal(valorReal, INR);   */

        const totalTime = Date.now() - startTime;

        console.log(`Conversões concluídas em ${totalTime} ms`);

        // Criação de um novo documento para ser salvo no banco de dados
        const novoRegistro = new Conversion({
        valorReal: valorReal,
        valorUSD:  valorUSD,
        valorEUR:  valorEUR,
        valorCAD:  valorCAD,
        valorJPY:  valorJPY,
        valorCNY:  valorCNY,
        valorGBP:  valorGBP,
        valorCHF:  valorCHF,
        valorTHB:  valorTHB,
        valorAUD:  valorAUD,
        valorINR:  valorINR
        });

      const salvo = await novoRegistro.save();
      console.log('Conversão salva com sucesso:', salvo);
      res.status(201).json(salvo);


    } catch (error) {
        console.error('Erro no processamento:', error);
    }   

  } catch (error) {
    console.error('Erro ao processar conversão:', error.message);
    res.status(500).json({ error: 'Erro ao buscar cotações ou salvar conversão' });
  }
});

const PORT = 3000; // Define a porta onde o servidor vai rodar

// Inicia o servidor Express e exibe uma mensagem indicando que ele está rodando
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
