const wppconnect = require("@wppconnect-team/wppconnect");


wppconnect
  .create({
    session: "WhatsMOD", //Pass the name of the client you want to start the bot
    statusFind: (statusSession, session) => {
      console.log("Status Session: ", statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      //Create session wss return "serverClose" case server for close
      console.log("Session name: ", session);
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

// Variável para rastrear o estado da conversa
const conversationState = {};

const lista = 
"1. [Nome do Dentista] - O seu sorriso pode mudar o mundo\n" +
"2. Link ao site\n" +
"3. Endereços - Manaus; Amazonas\n" +
"4. Finalizar o atendimento";

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

function handleConversation(client, user, message) {
  const state = conversationState[user]; // Aqui state vai receber vai obter o estado atual do user em especifico salvo no objeto conversationState
  switch (state.step) {
    case 0:
      mensagemInicial(client, user);
      state.step = 1;
      break;
    case 1:
      const choice = parseInt(message);
      if (!isNaN(choice) && choice >= 1 && choice <= 3) {
        handleChoice(client, user, choice);
        state.step = 1; // Mantem na mesma linha de escolhas
      } else if (!isNaN(choice) && choice == 4) {
        handleChoice(client, user, choice);
        state.step = 0; // Reiniciar o ciclo
      } else {
        sendDefaultResponse(client, user);
      }
      break;
  }
}

function handleChoice(client, user, choice) {
  switch (choice) {
    case 1:
      funcOne(client, user);
      break;
    case 2:
      funcTwo(client, user);
      break;
    case 3:
      funcThr(client, user);
      break;
    case 4:
      finalizando(client, user);
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
  const textoInicial =
    saudacao +
    ", Bem vindo ao ChatBot do [Nome do Dentista].";
  const opcoesMensagem =
    "A seguir algumas opções para você:\n" +
    lista;

  try {
    // Envie a saudação
    await client.sendText(texto, textoInicial);

    // Envie as opções
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
  const response =
    "Olá e seja bem-vindo à Clínica Odontológica [Nome]! Estamos entusiasmados por ter a oportunidade de cuidar da sua saúde bucal. Nossa equipe dedicada está aqui para proporcionar a você uma experiência odontológica excepcional e personalizada.";

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

async function funcTwo(client, text) {
  const response =
    "Acesse o site do [Nome do Dentista] por esse link:\n" +
    "[LINK]";

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
  const response =
    "A seguir a lista de endereços do [Nome do Dentista]" +
    "\n\n[Endereço 1]" +
    "\n\n[Endereço 2]";

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