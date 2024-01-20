const wppconnect = require("@wppconnect-team/wppconnect");


wppconnect
  .create({
    session: "Diego G.", //Pass the name of the client you want to start the bot
    statusFind: (statusSession, session) => {
      console.log("Status da Sessão: ", statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      //Create session wss return "serverClose" case server for close
      console.log("Nome da Sessão: ", session);
    },
    headless: true, // Headless chrome
    devtools: false, // Open devtools by default
    useChrome: true, // If false will use Chromium instance
    debug: false, // Opens a debug session
    logQR: true, // Logs QR automatically in terminal
    browserWS: "", // If u want to use browserWSEndpoint
    browserArgs: [""], // Parameters to be added into the chrome browser instance
    puppeteerOptions: {}, // Will be passed to puppeteer.launch
    disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
    updatesLog: true, // Logs info updates automatically in terminal
    autoClose: 60000, // Automatically closes the wppconnect only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    tokenStore: "file", // Define how work with tokens, that can be a custom interface
    folderNameToken: "./tokens", //folder name when saving tokens
    // BrowserSessionToken
    // To receive the client's token use the function await clinet.getSessionTokenBrowser()
    sessionToken: {
      WABrowserId: '"UnXjH....."',
      WASecretBundle:
        '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
      WAToken1: '"0i8...."',
      WAToken2: '"1@lPpzwC...."',
    },
  })
  .then((client) => start(client))
  .catch((error) => {
    console.log(error);
  });




/*
function start(client) {
  let timerId;

  // Função para enviar a mensagem de lembrete
  function enviarLembrete() {
    client
      .sendText(client.session.user, "Você ainda está aí?")
      .then(() => console.log("Mensagem de lembrete enviada"))
      .catch((erro) => console.error("Erro ao enviar mensagem de lembrete: ", erro));
  }

  // Função para reiniciar o temporizador
  function reiniciarTemporizador() {
    clearInterval(timerId); // Limpa o temporizador existente
    timerId = setInterval(enviarLembrete, 10000); // Configura um novo temporizador de 10 segundos
  }

  // Configura o temporizador inicial
  reiniciarTemporizador();

  // Ouvinte para mensagens recebidas
  client.onMessage(async (message) => {
    console.log("Mensagem recebida:", message.body);

    // Reinicia o temporizador sempre que uma mensagem é recebida
    reiniciarTemporizador();

    // Verifica se a mensagem é a resposta ao lembrete
    if (message.body.toLowerCase().includes("ops, eu não tinha percebido")) {
      clearInterval(timerId); // Limpa o temporizador se a resposta for recebida
      console.log("Cliente respondeu ao lembrete");
    }
  });
}

*/



// Variável para rastrear o estado da conversa
const conversationState = {};

const lista = "Para escolher sobre qual assunto vamos conversar hoje, digite o *número* correspondente a uma das opções abaixo:\n\n" +
  "*2* - _Informações e Endereço da Clínica_\n" +
  "*3* - _Tipos de Serviços_\n" +
  "*4* - _Marcar Consulta_\n" +
  "*5* - _Cancelar Consulta_\n" +
  "*6* - _Paciente Clube+_\n" +
  "*7* - _Contratar Planos Clube+_\n" +
  "*8* - _Redes Sociais_\n\n" +
  "*9* - _Finalizar conversa_";

const lista2 = "Digite o número referente a uma das opções abaixo:\n\n*1 - Atendimento*\n\n*9 - Finalizar Conversa*";

const lista3 = "Aqui estão alguns dos tipos de serviços que oferecemos:\n\n" +
  "1. *Ultrassonografia Geral:*\n• Dr. _Daniel Palácios_\n\n" +
  "2. *Fonoaudiologia:*\n• _Ada Nogueira_\n\n" +
  "3. *Neuropsicologia:*\n• _Dheniff Kelly_\n\n" +
  "4. *Pediatria:*\n• ~Não Identificado~\n\n" +
  "5. *Clínico Geral:*\n• _Dr. Edmundo Roca_\n\n" +
  "Se precisar agendar consulta, digite *5 (Marcar Consulta)* para receber mais informações sobre.";

function start(client) {
  client.onMessage((message) => {
    if (message.isGroupMsg === false) {
      const user = message.from; //Aqui é armazenada as informações do user que está interagindo com o bot(message.from = mensagem de "user")
      if (!conversationState[user]) {
        //Aqui faz um teste se o user já existe, caso não ele cria na proxima linha e incia na etapa 0
        conversationState[user] = { step: 0 };
      }

      handleConversation(client, user, message.body); //(cliente atual, dados do user de origem, corpo da mensagem)
    }
  });

}

// LIDAR COM CONVERSAS
function handleConversation(client, user, message) {
  const state = conversationState[user]; // Aqui state vai receber vai obter o estado atual do user em especifico salvo no objeto conversationState
  switch (state.step) {
    case 0:
      mensagemInicial(client, user);
      state.step = 1;
      break;
    case 1:
      const choice = parseInt(message);
      if (!isNaN(choice) && choice >= 1 && choice <= 8) {
        handleChoice(client, user, choice);
        state.step = 1; // Mantem na mesma linha de escolhas
      } else if (!isNaN(choice) && choice == 9) {
        handleChoice(client, user, choice);
        state.step = 0; // Reiniciar o ciclo
      } else {
        sendDefaultResponse(client, user);
      }
      break;
  }
}

//LIDAR COM DECISÕES 
function handleChoice(client, user, choice) {
  switch (choice) {
    case 1:
      funcTwo(client, user);
      break;
    case 9:
      finalizando(client, user);
      break;
    case 2:
      funcOne(client, user);
      break;
    case 3:
      funcThr(client, user);
      break;
    default:
      sendDefaultResponse(client, user);
  }
}

function saudacaoPorHora() {
  const horaAtual = new Date().getHours();

  if (horaAtual >= 5 && horaAtual < 12) {
    return "Olá, Bom dia!";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    return "Olá, Boa tarde!";
  } else {
    return "Olá, Boa noite!";
  }
}

async function mensagemInicial(client, texto) {
  const saudacao = saudacaoPorHora(); // Obtenha a saudação com base na hora atual
  const textoInicial = saudacao;
  const PrimeiraMsg = 'Eu sou Atendente Virtual da Clínica _CEMED_.\nNosso horário de atendimento é de *segunda a sexta-feira, das 8:00h às 18:00h.*'
  const opcoesMensagem = lista2;

  try {
    await client.sendText(texto, textoInicial);
    await client.sendText(texto, PrimeiraMsg);
    await client.sendText(texto, opcoesMensagem);

    console.log("Mensagens enviadas com sucesso.");
  } catch (erro) {
    console.error("Erro ao enviar mensagens: ", erro);
  }
}
/*
  client
  .sendText(texto, textoInicial)
  .then((result) => {
    console.log("Result: ", result);
  })
  .catch((error) => {
    console.error("Erro ao enviar mensagem: ", error);
  });*/

async function sendDefaultResponse(client, recipient) {
  // Resposta padrão para mensagens que o bot não entende.
  const response =
    "Desculpe, não entendi sua pergunta. Por favor, digite algo referente as opções para obter informações relevantes.";

  try {
    let resultado = await client.sendText(recipient, response);
    console.log("Result: ", resultado);
  } catch (erro) {
    console.error("Error when sending: ", erro); //return object error
  }
  /*  client
    .sendText(recipient, response)
    .then((result) => {
      console.log("Result: ", result);
    })
    .catch((error) => {
      console.error("Erro ao enviar mensagem: ", error);
    });*/
}

async function funcOne(client, text) {
  const resposta1 = "Olá e seja bem-vindo à Clínica _CEMED_!\n\n*CONTATOS*\nE-mail: *cemedlabrea@gmail.com*\nTelefone(s): *(97) 98457-8779*\n\n*LOCALIZAÇÃO*:\nLogradouro: *Avenida Getúlio Vargas, N° 162.*\nComplemento: *Sala 01.*\nBairro: *Centro.*\nCEP: *69830-000.*\nMunicípio: *Lábrea.*\nEstado: *Amazonas.*\n\nLink abaixo da localização no Google Maps.";
  const resposta2 = "https://maps.app.goo.gl/ehVpcXb32rTZP1Bm7"
  try {
    let resultado = await client.sendText(text, resposta1);
    console.log("Result: ", resultado);
    let resultado2 = await client.sendText(text, resposta2);
    console.log("Result: ", resultado2);

  } catch (erro) {
    console.error("Error when sending: ", erro); //return object error
  }

  /*client
    .sendText(text, response)
    .then((result) => {
      console.log("Result: ", result);
    })
    .catch((error) => {
      console.error("Erro ao enviar mensagem: ", error);
    });*/
}

async function funcTwo(client, text) {
  const response = lista;

  try {
    let resultado = await client.sendText(text, response);
    console.log("Result: ", resultado);
    // let resultado2 = await client.sendText(text, lista);
    // console.log("Result: ", resultado2);
  } catch (erro) {
    console.error("Error when sending: ", erro); //return object error
  }

  /* client
     .sendText(text, response)
     .then((result) => {
       console.log("Result: ", result);
     })
     .catch((error) => {
       console.error("Erro ao enviar mensagem: ", error);
     });*/
}

async function funcThr(client, text) {
  const response = lista3;

  try {
    let resultado = await client.sendText(text, response);
    console.log("Result: ", resultado);
    // let resultado2 = await client.sendText(text, lista);
    // console.log("Result: ", resultado2);
  } catch (erro) {
    console.error("Error when sending: ", erro); //return object error
  }

  /*client
    .sendText(text, response)
    .then((result) => {
      console.log("Result: ", result);
    })
    .catch((error) => {
      console.error("Erro ao enviar mensagem: ", error);
    });*/
}

async function finalizando(client, text) {
  const response = "Obrigado por entrar em contato. Espero ter ajudado.";

  try {
    let resultado = await client.sendText(text, response);
    console.log("Result: ", resultado);
  } catch (erro) {
    console.error("Error when sending: ", erro); //return object error
  }

  /*client
    .sendText(text, response)
    .then((result) => {
      console.log("Result: ", result);
    })
    .catch((error) => {
      console.error("Erro ao enviar mensagem: ", error);
    });*/
}
