const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const credenc = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

const pool = mysql.createPool(credenc);

let conn;

async function Connection() {

  try {
    conn = await pool.getConnection();
    module.exports = conn;
    console.log('Conectado ao banco de dados! ');

    /*
    const table = `CREATE TABLE IF NOT EXISTS admin ( 
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL,
        pass VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    */
    const table1 = `CREATE TABLE IF NOT EXISTS consult (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feitas INT NOT NULL,
        acepted INT NOT NULL,
        nacepted INT NOT NULL
      )`;


    try {
      await conn.execute(table1);
      /*
        const [initialInsert] = await conn.execute('UPDATE consult SET feitas = ? WHERE id = ?', [1, 1]);
        console.log('Tabela inicial criada & Dados padrão inseridos com sucesso! ');
        console.log(initialInsert);
      */
      // Crição do Usuário padrão ( Excutar um vez o codigo com este trecho, depois comentar )
      /*  
        const initalValues = ['Admin', 'admin'];
        const senhaHash = await bcrypt.hash(initalValues[1], 10);
        
        const [insert] = await conn.execute('INSERT INTO admin (name, pass) VALUES (?, ?)', [initalValues[0], senhaHash]);
        */
      console.log("Usuário padrão definido  \n User: Admin  && Pass: Admin");

    } catch (error) {
      console.log("❌ Erro ao criar tabela: ", error.message);
    }

  }
  catch (err) {
    console.log('Deu ruim na conexão: ', err.message);
  }

  console.log('Rodando em http://localhost:2020/api');
}

module.exports = { Connection, pool }