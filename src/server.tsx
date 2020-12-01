import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { tmpdir } from 'os';
import Purview from 'purview';
import { createConnection } from 'typeorm';

import { Todo } from './entities/todo.entity';
import TodoView from './views/todo.view';

const devMode = process.env.NODE_ENV != 'production';
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
    <link rel="stylesheet" href="https://unpkg.com/todomvc-common@1.0.5/base.css" />
    <link rel="stylesheet" href="https://unpkg.com/todomvc-app-css@2.3.0/index.css" />
  </head>
  <body>
    ${await Purview.render(<TodoView />, req)}
    <footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Created by <a href="https://leosuncin.github.io">Jaime Suncin</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
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

async function startServer(): Promise<void> {
  try {
    await createConnection({
      type: 'sqlite',
      database: tmpdir() + '/todos.db',
      synchronize: devMode,
      logging: devMode,
      entities: [Todo],
    });

    server.listen(port, () => console.log(`Listening on localhost:${port}`));
  } catch (error) {
    console.error('TypeORM connection error:', error);
    process.exit(1);
  }
}

startServer();
