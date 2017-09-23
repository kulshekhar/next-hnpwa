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

    server.use('/', routes({ app }));

    server.get('/service-worker.js', (req, res) => {
      res.sendFile(swPath);
    });
    server.get('/manifest.json', (req, res) => {
      res.sendFile(manifestPath);
    });

    server.get('*', (req, res) => {
      console.log('>>>1', req.headers);
      console.log('>>>2', req.header);
      console.log('>>>3', req.get('x-forwarded-proto'));
      console.log('>>>4', req.headers['x-forwarded-proto']);
      console.log('>>>5', req.hostname);
      console.log('>>>6', req.host);
      console.log('>>>7', req.protocol);

      if (req.headers['x-forwarded-proto'] != 'https') {
        res.redirect(`https://${req.hostname}${req.url}`);
      } else {
        return handle(req, res);
      }
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

})();
