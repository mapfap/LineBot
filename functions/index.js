const functions = require('firebase-functions');
const request = require('request-promise');

const lineEndpoint = 'https://api.line.me/v2/bot';
const defaultHeaders = {
  'Content-Type': 'application/json',
  // firebase functions:config:set line.token=
  // firebase functions:config:get > .runtimeconfig.json
  // export CLOUD_RUNTIME_CONFIG=$(cat .runtimeconfig.json)
  'Authorization': `Bearer ${functions.config().line.token}`
}

const sendToLine = (to, text) => {
  return request({
    method: `POST`,
    uri: `${lineEndpoint}/message/push`,
    headers: defaultHeaders,
    body: {
      to: to,
      messages: [{
          type: 'text',
          text: text
        }
      ]
    },
    json: true
  })
}

const replyDefaultMessage = (res, to, text) => {
  sendToLine(to, text).then(() => {
    const result = `Success ${text}`;
    console.log(result);
    return result;
  }).catch((e) => {
    const result = `Fail ${e}`;
    console.log(e);
    return result;
  });
}

exports.receiveMessage = functions.https.onRequest((req, res) => {
  for (const event of req.body.events) {
    console.log(event.source);
    if (event.source.type === 'user') {
      console.log(event.source.userId);
      replyDefaultMessage(res, event.source.userId, `สวัสดี: "${event.source.userId}"`);
    }
  }
  res.status(200).send(`It's ok`);
});

exports.sendMessage = functions.https.onRequest((req, res) => {
  const text = req.query.text;
  sendToLine('Udae51d441935a67d88bf45388ed42c4c', text).then(() => {
    const result = `Success ${text}`;
    console.log(result);
    return res.status(200).send(result);
  }).catch((e) => {
    const result = `Fail ${e}`;
    console.log(e);
    return res.status(200).send(result);
  });
});
