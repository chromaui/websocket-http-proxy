import http from 'http';
import { Server } from 'ws';

const HTTP_PORT = 5005;
const WS_PORT = 5006;

let currentWs;
let nextId = 0;
const waitingResponses = {};

http.createServer(function(req, res) {
  if (!currentWs) {
    res.end("NO WS");
    return;
  }

  const id = nextId;
  nextId += 1;
  waitingResponses[id] = res;
  currentWs.send(JSON.stringify({
    id,
    path: req.url,
    headers: req.headers,
  }));
}).listen(HTTP_PORT);


const wss = new Server({ port: WS_PORT });

wss.on('connection', ws => {
  console.log('got socket');
  currentWs = ws;

  ws.on('message', data => {
    // console.log(data)
    const { id, text, headers } = JSON.parse(data);
    const res = waitingResponses[id];
    if (!res) {
      throw new Error(`No Response for ${id}`);
    }

    // Object.keys(headers).forEach(name => res.setHeader(name, headers[name]));
    res.end(text);
  });
});
