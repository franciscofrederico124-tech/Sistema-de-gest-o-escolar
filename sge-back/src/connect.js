const mysql = require('mysql2/promise');   // Importante: usar /promise

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',     
  database: 'sge',     
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function InitSystem() {
  try {
    // Correção: "IF NOT EXISTS" e "AUTO_INCREMENT"
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(250) NOT NULL,
        password VARCHAR(250) NOT NULL,
        role VARCHAR(250) DEFAULT 'admin'
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS alunos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(250) NOT NULL,
        apelido VARCHAR(250) NOT NULL,
        uid VARCHAR(250) NOT NULL,
        sala VARCHAR(250) NOT NULL,
        classe VARCHAR(250) NOT NULL,
        documentos VARCHAR(250) NOT NULL,
        regularizado VARCHAR(250) NOT NULL
      )
    `);
    
    console.log(".........................................");
    console.log("Configuração completa!.");
    console.log(".........................................");
  }
  catch (e) {
    console.log("Erro: ", e.message);
  }
}

InitSystem();

module.exports = db;