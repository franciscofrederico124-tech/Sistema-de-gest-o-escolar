const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { pool } = require('./conn.js');
require('dotenv').config();

const conn = pool;
let readPermition = false;

async function Login(req, res) {

  const { name, pass } = req.body;

  console.log(name, ' ', pass);
  console.log('Requerindo...........');

  let response = {}
  if (name == process.env.DB_USER && pass == process.env.DB_PASS) {
    response = {
      state: 200,
      acepted: true,
      error: {
        message: '',
      }
    }
  }
  else {
    response = {
      state: 400,
      acepted: false,
      error: {
        message: 'Data is not valid'
      }
    }
  }

  res.status(response.state).json(response);
}

async function Regularizados(req, res) {
  console.log("Requerindo 'Consultas'...");
  const data = await conn.execute('SELECT * FROM consult WHERE id = ?', [1])
  res.send(data[0][0].acepted);
  console.log("Taxistas Aprovados: ", data[0][0].acepted);
  //res.json({state: true, consultas: data.feitas});
}
async function Nregularizados(req, res) {
  console.log("NRegulacao Rodando...");
  const data = await conn.execute('SELECT * FROM consult WHERE id = ?', [1])
  res.send(data[0][0].nacepted);
  console.log("Taxistas Reprovados: ", data[0][0].nacepted);
}

async function Consulta(req, res) {
  console.log("Consulta Rodando...");
  const data = await conn.execute('SELECT * FROM consult WHERE id = ?', [1])
  res.send(data[0][0].feitas);
  console.log("Total interpoldos: ", data[0][0].feitas);
  //res.json({state: true, nregularizados: data.nacepted});
}

// Processos para leitura da Card.
async function RequestReading(req, res) {
  try {
    console.log('Lendo....');
    res.status(200).json({ read: true });
    readPermition = true;
  }
  catch (error) {
    console.log("Deu ruim na leitura", error.message);
    res.status(400).json({ read: false });
    readPermition = false;
  }
}

async function CancelRead(req, res) {
  try {
    console.log('Cancelando......');
    res.status(200).json({ Cancelread: true });
    readPermition = false;
  }
  catch (error) {
    console.log("Deu ruim no cancelamento", error.message);
    res.status(400).json({ readRead: false });
    readPermition = readPermition;
  }
}

//Carregamento do Histórico de leituras
async function RequestHistoric(req, res) {
  try {
    const data = await conn.execute("SELECT * FROM taxistas");
    console.log('Dados: ', data);
    res.status(200).json({ state: true, Dados: data[0] });
  } catch (error) {
    console.log('No Historic! ');
    res.status(400).json({ state: false });
  }
}

// Criação de objectos por classiicação de tarefas
const Consult = {
  consulta: Consulta,
  regularizados: Regularizados,
  nregularizados: Nregularizados,
}

const CardReading = {
  requestReading: RequestReading,
  requestHistoric: RequestHistoric,
  cancelRead: CancelRead,
  getPermitionRead: GetPermitionRead
}


//Informações do sistema

async function ApiSytemInfo(req, res) {
  res.json({ info: 'Dados do sustema' });
}

// Outras funcões 

async function GetPermitionRead() {
  return readPermition
}

// exportação geral das funcões / Objectos
module.exports = { Login, Consult, CardReading, ApiSytemInfo }