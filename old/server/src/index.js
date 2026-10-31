import { WebSocketServer } from 'ws';
import http from 'http';
import { createMockTelemetryGenerator } from './mockEngine.js';

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ status: 'online', service: 'ApexLink Telemetry Relay', clients: wss.clients.size }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ApexLink Telemetry Server');
});

const wss = new WebSocketServer({ server });
const getNextFrame = createMockTelemetryGenerator();

console.log(`🚀 ApexLink Telemetry Server levantando en http://localhost:${PORT}`);
console.log(`📡 WebSocket stream listo en ws://localhost:${PORT}`);

// Loop de emisión a 60 FPS (~16ms)
setInterval(() => {
  if (wss.clients.size === 0) return;

  const frame = getNextFrame();
  const payload = JSON.stringify(frame);

  for (const client of wss.clients) {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  }
}, 16);

server.listen(PORT);
