const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3010');

ws.on('open', function open() {
    console.log("Open");
  ws.send('something');
});

ws.on('message', function incoming(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log("Recieved: "+data);
});

