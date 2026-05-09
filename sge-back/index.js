const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./src/connect");

app.use(cors({
  origin: "*"
}));

let user = null;


const porta = 3001;
app.get("/auth/login", async (req, res) => {

try {
  const { name, password } = req.body;
  
    if ( name && password && name.trim() !== "" && password != "")
    {
      const [data] = await db.execute("SELECT password FROM users WHERE name = ? ", [name]);
      if ( data.length === 0)
      {
        const passwordData = data[0];
        let logged = bcrypt.test(passwordData, password);
        if ( logged )
        {
          user = {
            "logged": true,
            "name": name,
          }
          return res.json({
            success: "true",
            message: "Sessão iniciada! "
          })
        }
      }
      else
      {
        return res.json({
          success: false,
          message: "Credenciais não validas! "
        })
      }
    }
    else
    {
      return res.json({
        success: true,
        message: "Credenciais inválidas! "
     })
    }
}
catch (e)
{
  console.log("Erro: ", e)
  return res.json({
    success: false,
    message: "Erro: "+ e.message
  })
}

})

app.post("/auth/logout", (req, res) => {
  user = null;
  
  return res.json({
    success: true,
    message: "Sessão termanda"
  })
})

app.get('/auth/check', (req, res) => {
  if (user) {
    res.json({
      success: true,
      user: user
    });
  } else {
    res.json({
      success: false,
      user: null
    });
  }
});

app.listen(porta, () => {
  console.log(`
Inicializando Sistema........
.............................
Terminando....................
    
••••••••••••••••••••••••••••••••••••••••••
• > Sistema inicializado com sucesso               
• > Servidor rodando em http://127.0.0.1:${porta}/ 
•                                                  
•••••••••••••••••••••••••••••••••••••••••
  `);
})