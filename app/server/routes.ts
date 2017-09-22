import * as express from 'express';
import { Server } from 'next';
import { Item } from './types';
import { HN } from './db';
import { getPageTitle } from './helpers';

const validListTypes = [
  'top',
  'best',
  'ask',
  'new',
  'show',
  'job'
];

export function routes(params: RouteParams): express.Router {
  const router = express.Router();
  const { app } = params;
  HN.initialize();

  router.get('/:api(_api)?/:list(top|new|best|ask|show|job)/:page(\\d+)', async (req, res) => {
    const items = await getList(req.params.list, parseInt(req.params.page));

    if (req.params.api) {
      res.json(items);
    } else {
      const pageTitle = getPageTitle(req.params.list);
      app.render(req, res, `/${req.params.list}`, { items, pageTitle });
    }

  });

  router.get('/:api(_api)?/:list(top|new|best|ask|show|job)', async (req, res) => {
    const items = await getList(req.params.list);

    if (req.params.api) {
      res.json(items);
    } else {
      const pageTitle = getPageTitle(req.params.list);
      app.render(req, res, `/${req.params.list}`, { items, pageTitle });
    }
  });

  router.get('/:api(_api)?/item/:id(\\d+)', async (req, res) => {
    const item = await HN.getItem(parseInt(req.params.id));

    if (req.params.api) {
      res.json(item);
    } else {
      app.render(req, res, '/item', { item });
    }
  });

  router.get('/', async (req, res) => {
    const items = await getList('top', 1);

    const pageTitle = getPageTitle('/');
    app.render(req, res, '/top', { items, pageTitle });
  });

  async function getList(listType: string, page: number = 1): Promise<Item[]> {
    if (validListTypes.indexOf(listType) >= 0) {
      try {
        return HN.getItems(listType, page);
      } catch (e) {
        console.error(e);
      }
    }

    return [];
  }

  return router;
}

export interface RouteParams {
  app: Server;
}
