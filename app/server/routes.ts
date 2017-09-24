import * as express from 'express';
import { Server } from 'next';
import { ListWrapper } from './types';
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

  router.get('/:api(_api)?/:list(top|new|best|ask|show|job)/:pageNo(\\d+)', async (req, res) => {
    const pageNo = parseInt(req.params.pageNo);
    const wrapper = await getList(req.params.list, pageNo);

    res.setHeader('Cache-Control', 'public, max-age=60');

    if (req.params.api) {
      res.json(wrapper);
    } else {
      const pageDetails = getPageDetails(req.params.list);
      app.render(req, res, `/${req.params.list}`, { ...wrapper, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: pageNo + 1, pageNo });
    }

  });

  router.get('/:api(_api)?/:list(top|new|best|ask|show|job)', async (req, res) => {
    const wrapper = await getList(req.params.list);

    res.setHeader('Cache-Control', 'public, max-age=60');

    if (req.params.api) {
      res.json(wrapper);
    } else {
      const pageDetails = getPageDetails(req.params.list);
      app.render(req, res, `/${req.params.list}`, { ...wrapper, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: 2 });
    }
  });

  router.get('/:api(_api)?/item/:id(\\d+)', async (req, res) => {
    const item = await HN.getExpandedItem(parseInt(req.params.id));

    res.setHeader('Cache-Control', 'public, max-age=60');

    if (req.params.api) {
      res.json(item);
    } else {
      app.render(req, res, '/item', { item });
    }
  });

  router.get('/', async (req, res) => {
    const wrapper = await getList('top', 1);

    res.setHeader('Cache-Control', 'public, max-age=60');

    const pageDetails = getPageDetails('/');
    app.render(req, res, '/top', { ...wrapper, pageTitle: pageDetails.title, pageName: pageDetails.page, nextPageNo: 2 });
  });

  router.get('/:api(_api)?/user/:id', async (req, res) => {
    const user = await HN.getUser(req.params.id);

    res.setHeader('Cache-Control', 'public, max-age=60');

    if (req.params.api) {
      res.json(user);
    } else {
      app.render(req, res, '/user', { user });
    }
  });

  async function getList(listType: string, page: number = 1): Promise<ListWrapper> {
    if (validListTypes.indexOf(listType) >= 0) {
      try {
        return HN.getItems(listType, page);
      } catch (e) {
        console.error(e);
      }
    }

    return { items: [], itemCount: 0, pageCount: 0 };
  }

  return router;
}

export interface RouteParams {
  app: Server;
}
