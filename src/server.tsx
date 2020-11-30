import express from 'express';
import http from 'http';
import Purview from 'purview';

import TodoView from './views/todo.view';

const port = process.env.PORT ?? 8000;
const app = express();
const server = http.createServer(app);

app.get('/', async (req: express.Request, res: express.Response): Promise<void> => {
    res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>TodoMVC with Purview</title>
  </head>
  <body>
    ${await Purview.render(<TodoView />, req)}
    <script src="/script.js"></script>
  </body>
</html>`);
  },
);

app.get('/script.js', (_, res: express.Response): void =>
  res.sendFile(Purview.scriptPath),
);

Purview.handleWebSocket(server, {
  origin: `http://localhost:${port}`,
});
server.listen(port, () => console.log(`Listening on localhost:${port}`));
