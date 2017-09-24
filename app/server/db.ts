import { database, app, apps, initializeApp } from 'firebase';
import { Item, User, ListWrapper } from './types';
import * as moment from 'moment';
import * as lru from 'lru-cache';

export class HN {
  private static domain = 'https://hacker-news.firebaseio.com';
  private static version = 'v0';
  private static app: app.App;

  private static ref: database.Reference;

  private static cache = lru<number | string, Item | ListWrapper>({
    max: 10000,
    stale: true,
    maxAge: 1 * 60 * 60 * 1000,
  });

  static async initialize() {
    if (apps.length === 0) {
      HN.app = initializeApp({
        databaseURL: HN.domain,
      });
    }

    if (!HN.ref) {
      HN.ref = await database().ref(`/${HN.version}`);
    }

  }

  private static async fetchItems(
    pathname: string,
    page: number,
    offset: number,
    limit: number,
  ): Promise<ListWrapper> {
    const cacheKey = `${pathname}${offset}`;

    const itemsSnapshot = await HN.ref.child(`${pathname}stories`)
      .once('value');

    const rawIds = itemsSnapshot.val();
    const itemCount: number = rawIds && rawIds.length ? rawIds.length : 0;
    const pageCount = Math.ceil(itemCount / limit);

    const itemIds: number[] = rawIds.slice(offset, offset + limit);

    const promises: Promise<Item>[] = (itemIds || []).map(HN.getItem);

    const rawItems = await Promise.all(promises);

    const items = (rawItems
      .map((item, i) => HN.processItem(item, i, offset))
      .filter(item => item !== null)
    );

    const listWrapper = { items, itemCount, pageCount };

    HN.cache.set(cacheKey, listWrapper);

    return listWrapper;
  }

  static async getItems(pathname: string, page: number = 1): Promise<ListWrapper> {
    const limit = 30;
    const offset = (page - 1) * limit;
    const cacheKey = `${pathname}${offset}`;

    if (HN.cache.has(cacheKey)) {
      HN.fetchItems(pathname, page, offset, limit);
      return HN.cache.get(cacheKey) as ListWrapper;
    }

    return HN.fetchItems(pathname, page, offset, limit);
  }

  private static processItem(item: Item, index: number = 0, offset = 0): Item {
    if (!item) return null;

    if (item.url) {
      const parts = item.url.split('/');
      if (parts.length > 1) {
        item.domain = parts[2];
      }
    }
    if (item.time) {
      item.moment = moment.unix(item.time).from(moment(new Date()));
    }
    item.index = offset + index + 1;
    return item;
  }

  static async getItem(id: number): Promise<Item> {
    if (HN.cache.has(id)) return HN.cache.get(id) as Item;

    const itemSnapshot = await HN.ref.child(`item/${id}`).once('value');
    const item = HN.processItem(itemSnapshot.val());
    HN.cache.set(id, item);

    return item;
  }

  static async getExpandedItem(
    id: number, level: number = 0): Promise<Item> {

    const item = await HN.getItem(id);

    item.level = level;

    item.subItems = await Promise.all(
      (item.kids || []).map(kidId => HN.getExpandedItem(kidId, level + 1))
    );

    return item;
  }

  static async getUser(id: string): Promise<User> {
    const snapshot = await HN.ref.child(`user/${id}`).once('value');
    return snapshot.val();
  }
}
