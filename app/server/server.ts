import * as path from 'path';

import * as express from 'express';
import * as next from 'next';
import * as compression from 'compression';

import { routes } from './routes';

// const distDir = process.env.APPENGINE ? path.join(__dirname, '..', '..', 'next') : path.join(__dirname, '..', 'next');
const distDir = 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir } });
const handle = app.getRequestHandler();

const swPath = path.join(__dirname, '..', 'next', 'service-worker.js');
const manifestPath = path.join(__dirname, '..', 'static', 'manifest.json');

const PORT = process.env.PORT || 3000;

(async () => {

  try {
    await app.prepare();

    const server = express();
    server.use(compression());

    server.use((req, res, next) => {
      if (req.host !== 'localhost' && req.get('X-FORWARDED-PROTO') === 'http') {
        res.redirect(`https://${req.host}${req.url}`);
        return;
      }
    });

    server.use('/', routes({ app }));

    server.get('/service-worker.js', (req, res) => {
      res.sendFile(swPath);
    });
    server.get('/manifest.json', (req, res) => {
      res.sendFile(manifestPath);
    });

    server.get('*', (req, res) => handle(req, res));



    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

})();
