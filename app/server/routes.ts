import * as express from 'express';
import { Server } from 'next';
import { Item } from './types';
import { HN } from './db';
import { getPageDetails } from './helpers';

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
    const pageNo = parseInt(req.params.page);
    const items = await getList(req.params.list, pageNo);

    if (req.params.api) {
      res.json(items);
    } else {
      const pageDetails = getPageDetails(req.params.list);
      app.render(req, res, `/${req.params.list}`, { items, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: pageNo + 1, pageNo });
    }

  });

  router.get('/:api(_api)?/:list(top|new|best|ask|show|job)', async (req, res) => {
    const items = await getList(req.params.list);

    if (req.params.api) {
      res.json(items);
    } else {
      const pageDetails = getPageDetails(req.params.list);
      app.render(req, res, `/${req.params.list}`, { items, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: 2 });
    }
  });

  router.get('/:api(_api)?/item/:id(\\d+)', async (req, res) => {
    const item = await HN.getExpandedItem(parseInt(req.params.id));

    if (req.params.api) {
      res.json(item);
    } else {
      app.render(req, res, '/item', { item });
    }
  });

  router.get('/', async (req, res) => {
    const items = await getList('top', 1);

    const pageDetails = getPageDetails('/');
    app.render(req, res, '/top', { items, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: 2 });
  });

  router.get(':api(_api)?/user/:id', async (req, res) => {
    const user = await HN.getUser(req.params.id);

    if (req.params.api) {
      res.json(user);
    } else {
      app.render(req, res, '/user', { user });
    }
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
