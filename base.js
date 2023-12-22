
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body === 'oi' || message.body === "Oi" && message.isGroupMsg === false) {

      try {
        let res = await client
          .sendText(message.from, 'Teste autobot @WPPConnect');
        console.log('Result: ', res);
      } catch (erro) {
        console.error('Error when sending: ', erro); //return object error
      }

      // .then((result) => {
      //   console.log('Result: ', result); //return object success
      // })
      // .catch((erro) => {
      //   console.error('Error when sending: ', erro); //return object error
      // });
    }
  });
}