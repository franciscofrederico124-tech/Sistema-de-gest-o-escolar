const marker = document.getElementById("marker");

const opcs = document.querySelectorAll('.opc');

const main = document.getElementById('container');
let themeDay = true;

let go;
let tema;
let cancel;


const section = document.getElementById('section');

const admin = document.getElementById('admin');
const user_name = document.getElementById("user_name");
const user_pass = document.getElementById("user_pass");
admin.addEventListener('submit', Login);

let getStartReading = false;



const api =
    [
        {
            "type": "DashBoard",
            "data": {
                "Consultas": {
                    "icon": "/images/check-circle.svg",
                    "feitas": `10`
                },
                "Regularizados": {
                    "icon": "/images/check-circle.svg",
                    "feitas": `10`
                },
                "N. Regularizados": {
                    "icon": "/images/exclamation-circle.svg",
                    "feitas": `10`
                }
            }
        },
        {
            "type": "Configurações",
            "data": {
                "Tema": {
                    "icon": "/images/day.svg",
                    "feitas": "Diurno"
                },
                "Remover hostórico": {
                    "icon": "/images/trash.svg",
                    "feitas": ""
                },
                "Actualizar": {
                    "icon": "/images/atualizar.svg",
                    "feitas": ""
                },
                "Novo usuário":  {
                    "icon": "/images/atualizar.svg",
                    "feitas": ""
                },
                "Sair ":  {
                    "icon": "/images/out.svg",
                    "feitas": ""
                },
                "Novo usuário": {
                    "icon": "/images/atualizar.svg",
                    "feitas": ""
                },
                "Sair ": {
                    "icon": "/images/out.svg",
                    "feitas": ""
                }
            }
        }
    ]
    
async function toMarker(text)
{
    marker.textContent = "/ "+text
}

opcs.forEach(opc => {
    opc.addEventListener('click', () => {

        switch (opc.name) {
            case 'dash':  DashBoad();
                break;

            case 'leitura':  Leitura();
                break;

            case 'historico':  Historico();
                break;

            case 'config':  Config();
                break;
        }


    })
})

async function DashBoad() {
    toMarker('Dashboard');
    getStartReading = false;
    RequestReading();
    
    section.style.display = "grid";
    Exit();

    opcs.forEach(opc => {
        if (opc.name == "dash") {
            opc.style.borderLeft = "2px solid blue"
        }
        else {
            opc.style.border = "none";
        }
    })
    section.style.opacity = 0;

    setTimeout(() => {
        section.innerHTML = '';

        api.forEach(async (items) => {
            if (items.type == "DashBoard") {
                let item = items.data;
                for (let cards in item) {
                    //console.log(cards);
                    let img = document.createElement("img");
                    
                    img.src = (item[cards]).icon;
                    img.style.height = "24px"


                    let div = document.createElement("div");
                
                let add;
                
                const response = await fetch(`http://localhost:2020/api/data/${cards.replace(' ', '').replace('.', '').replace('ó', 'o').toLowerCase()}`);
                add = await response.json();
                console.log(add);
                    div.textContent = cards + ": " + add
            
                    div.classList.add("cards")

                    div.appendChild(img);

                    section.append(div)
                }
            }

            setTimeout(() => {
                section.style.opacity = 1;
            }, 16)
        })

    }, 16);
}

async function Config() {
    toMarker('Config')
    getStartReading = false;
    RequestReading();
    
    section.style.display = "grid";
    
    Exit();
    
    opcs.forEach(opc => {
        if (opc.name == "config") {
            opc.style.borderLeft = "2px solid blue"
        }
        else {
            opc.style.border = "none"
        }
    })

    section.style.opacity = 0;

    setTimeout(() => {
        section.innerHTML = '';

        api.forEach(items => {
            if (items.type == "Configurações") {
                let item = items.data;
                for (let cards in item) {

                    if (cards != "Actualizar") {
                       // console.log(cards);
                        let img = document.createElement("img");
                        img.src = (item[cards]).icon;
                        img.style.height = "24px"


                        let div = document.createElement("div");
                
                if(cards.toLowerCase() === 'tema') div.addEventListener('click', AlterThemes);
                        div.textContent = cards + ": " + `${item[cards].feitas}`
                
                        div.classList.add("cards")

                        div.appendChild(img);

                        section.append(div)
                    }
                    else {
                        let img = document.createElement("img");
                        img.src = (item[cards]).icon;
                        img.style.height = "24px"


                        let div = document.createElement("div");
                        div.textContent = cards 

                        div.classList.add("cards")

                        div.appendChild(img);


                        section.append(div)
                    }

                }
            }

            setTimeout(() => {
                section.style.opacity = 1;
            }, 16)
        })

    }, 16);
}

async function Leitura() {
    toMarker('Leitura')
    section.style.display = "flex";
    Exit();
    opcs.forEach(opc => {
        if (opc.name == "leitura") {
            opc.style.borderLeft = "2px solid blue"
        }
        else {
            opc.style.border = "none";
        }
    })
    section.style.opacity = 0;

    setTimeout(() => {
        section.innerHTML = '';

        setTimeout(() => {

            const d1 = document.createElement("div")
            d1.classList.add("cardLeitura");

            const d2 = document.createElement("div")
            d2.textContent = "Aproxime o identificador RFID..."
            d2.style.fontWeight = "500"
            cancel = document.createElement('button');
            cancel.textContent = "Cancelar ";
        
            cancel.style.background = 'red'
            cancel.style.height  = "40px"
            cancel.style.fontSize = "16px";
            cancel.style.fontWeight = "400"
            d2.appendChild(cancel);
            
            let img = document.createElement("img")
            img.classList.add("iconCard")
            img.src = "/images/card.svg",
            
            d2.appendChild(img)
            d2.id = "cardDiv";
            
            d1.appendChild(d2)
             section.appendChild(d1);
             
             let b = document.createElement('button');
             
             b.innerHTML = "Começar Leitura";
             d1.appendChild(b)
             b.id = "go";
             
             const cardDiv = document.getElementById("cardDiv");
             
             cardDiv.style.display = "none";
             cardDiv.style.opacity = "1"
             
             
             
             go = document.getElementById("go");
             
             go.addEventListener("click", async () => {
                 getStartReading = true;
                RequestReading();
                 go.style.opacity = "0"
                 setTimeout(() => {
                     go.style.display = "none";
                     cardDiv.style.display = "flex";
                     setTimeout(() => {
                        cardDiv.style.opacity = "1"
                     }, 100)
                 }, 150)
             })

            setTimeout(() => {
                section.style.opacity = "1";
                
                cancel.addEventListener('click', async () => {
                    getStartReading = false;
                
                try {
                const cancelRead = await fetch('http://localhost:2020/api/user/cardreading/false');
                const response = await cancelRead.json()
               console.log(response);
                }catch(error) {
                    console.error("Deu ruim: ", error.message);
                }
                RequestReading();
                cardDiv.style.transition = "all .15s ease-in-out";
                cardDiv.style.opacity = 0;
                setTimeout(() => {
                   cardDiv.style.display = "none";
                   go.style.display = "inline-block";
                   setTimeout(() => {
                       go.style.opacity = 1;
                   }, 150)
                }, 150)
            })
        
            }, 16)

        }, 16);
    }, 16)
}


async function Historico() {
    toMarker('Histórico');
    getSelection = false;
    
    RequestHistoric();
    
    section.style.opacity = "0"
    section.style.display = "grid";
    Exit();
    opcs.forEach(opc => {
        if (opc.name == "historico") {
            opc.style.borderLeft = "2px solid blue"
        }
        else {
            opc.style.border = "none"
        }
    })
}




const exit = document.querySelector('.exit');
const menu = document.getElementById('menu');
const nav = document.getElementById('aside');
const items = document.getElementById('items')

menu.addEventListener('click', () => {
    //nav.style.display = "flex";
    setTimeout(() => {
    nav.classList.remove("visible");
    }, 140)
})

exit.addEventListener('click',Exit);

function Exit() {
    nav.classList.add("visible");
    setTimeout(() => {
   // nav.style.display = "none";
}, 100)
}

async function Login(event) {
    event.preventDefault();
    const name = user_name.value;
    const pass = user_pass.value;
    /*alert(name)
    alert(pass)*/
    
    if(name.trim() != '' && pass.trim() != '' && pass.trim().length >= 5 && name.trim().length >= 5) {
        let loginState = await Require(name, pass);
          
          if(loginState === true)
         {
             Acepted(name);
         }
         else {
             Rejected();
         }
         // alert(loginState); 
          
    }else{
        console.log('status: Error')
    }
}

async function Require(n, p) {
    try {
        
        const resposta = await fetch('http://localhost:2020/api/user/validate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: n, pass: p})
        });
        
        const data = await resposta.json();
        console.log('Data: ', data);
        
        return ( data.acepted == true && data.state == 200)?true:false;

    } catch (error) {
        console.error('Deu ruim: ', error.message);
        return false
    }
    
}

function Acepted(name) {
    
    alert(`Seje bem vindo(a) ${name} 👤✅`);
    
    setTimeout(() => {
      admin.style.opacity = "0";
      setTimeout(() => {
          admin.style.display = "none";
          main.style.display = "block";
          setTimeout(() => {
              main.style.opacity = "1"
          }, 150)
      }, 400)
    }, 150);
}

function Rejected() {
    alert("Ocorreu um erro ❌ \n Tente novamente ");
    
    user_name.value = '';
    user_pass.value = '';
}

function AlterThemes() {
    
}

async function RequestHistoric() {
    const response = await fetch('http://localhost:2020/api/user/historicread');
    
    console.log(await response.json())
}

async function RequestReading()
{
    let finished = false;
    
    if(getStartReading) {
      try {
        const response = await fetch('http://localhost:2020/api/user/cardreading/true');
        const text = await response.json();
        finished = text.read;
        
        console.log(text);
      } catch (error) {
         console.error('Deu Ruim: ', error.message);
      }
    }
    else console.log('Awaiting...');
    
    setInterval(() => {
        if(finished) {
            cancel.style.background = "green";
        }
    }, 150)
}


DashBoad()


RequestReading();