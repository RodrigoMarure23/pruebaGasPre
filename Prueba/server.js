import http from 'http';
import api from './api/api.js';
import { conectarbd, port } from './api/routes/estacionRoutes.js';
const puerto = port
const server = http.createServer(api);
server.on('listening', () => {
  console.log('Server corriendo en el puerto', puerto);
});

server.on('error', () => {
  console.log('Error al ejecutar el server en el puerto', puerto);
});

server.listen(puerto);
conectarbd();