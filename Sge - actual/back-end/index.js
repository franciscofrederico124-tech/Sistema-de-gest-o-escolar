// Importação de modulos ( Bibliotecas )
const express = require('express');
const cors = require('cors');
const memory = process.memoryUsage();
const system = require('os');
const { Connection } = require('./conn.js');
const { Login, Consult, CardReading, ApiSystemInfo } = require('./endpoints.js');
// Configurações gearais do servidor
const server = express();
const port = 2020;
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Criação de Rotas get / Post

// Login - Validação
server.post('/api/user/validate/', Login);

// Dados do sistema: Consultas, regularizados, não regularizados...
server.get('/api/data/consultas', Consult.consulta);
server.get('/api/data/regularizados', Consult.regularizados);
server.get('/api/data/nregularizados', Consult.nregularizados);

//Leitura da Tag
server.get('/api/user/cardreading/true/', CardReading.requestReading);

//Cancelamento de leitura
server.get('/api/user/cardreading/false/', CardReading.cancelRead);

//Solicitação de histórico de leitura ( Ultimos 6 )
server.get('/api/user/historicread/', CardReading.requestHistoric);

let state;

const Timer = setInterval(() => {
  server.get('/', async (req, res) => {
    state = await CardReading.getPermitionRead();

    if (state == true) {
      res.send('Esp32 deliberado pra ler');
      server.get('/esp', (req, res) => {
        res.json({ read: state });
      })
    }
    else {
      res.send('Aguardando permissão');
      server.get('/esp', async (req, res) => {

        const { response, uid } = req.body
        res.json({ reading: state });

        const read = await conn.execute('SELECT uid FROM taxistas WHERE uid = ?', [uid]);
      })
    }
  })
}, 150);


// Informacões do sistema
//gerver.get('/api/system/info/', ApiSystemInfo);

//Ligação do servidor
server.listen(port, Connection);