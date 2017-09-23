import { https } from 'firebase-functions';

import * as express from 'express';
import * as next from 'next';

import { routes } from './server/routes';
import { HN } from './server/db';

const nxt = next({ dev: false, conf: { distDir: 'next' } });
if (nxt) { }
const handle = nxt.getRequestHandler();
const app = express();
let nextPrepared = false;

module.exports = {
  fbapp: https.onRequest(async (req, res) => {
    if (nextPrepared === false) {
      console.log('>> preparing next');
      await HN.initialize();
      await nxt.prepare();

      app.use('/', routes({ app: nxt }));
      app.get('*', (req, res) => handle(req, res));
      nextPrepared = true;
    }

    return app(req, res);
  })
};

// module.exports = {
//   fbapp: https.onRequest(async (req, res) => {
//     res.send('Hello there');
//   })
// };
