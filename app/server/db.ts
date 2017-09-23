import { database, app, apps, initializeApp } from 'firebase';
import { Item, User } from './types';
import * as moment from 'moment';
import * as lru from 'lru-cache';
import * as f from 'isomorphic-unfetch';

export class HN {
  private static domain = 'https://hacker-news.firebaseio.com';
  private static version = 'v0';
  private static app: app.App;

  private static ref: database.Reference;

  private static cache = lru<number | string, Item | Item[]>({
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
  ): Promise<Item[]> {
    const cacheKey = `${pathname}${offset}`;

    const itemsSnapshot = await HN.ref.child(`${pathname}stories`)
      .limitToFirst(limit * page)
      .once('value');

    const itemIds: number[] = itemsSnapshot.val().slice(offset, offset + limit);

    const promises: Promise<Item>[] = (itemIds || []).map(HN.getItem);

    const items = await Promise.all(promises);

    const processedItems = (items
      .map((item, i) => HN.processItem(item, i, offset))
      .filter(item => item !== null)
    );

    HN.cache.set(cacheKey, processedItems);

    return processedItems;
  }

  static async getItems(pathname: string, page: number = 1): Promise<Item[]> {
    const limit = 30;
    const offset = (page - 1) * limit;
    const cacheKey = `${pathname}${offset}`;

    if (HN.cache.has(cacheKey)) {
      HN.fetchItems(pathname, page, offset, limit);
      return HN.cache.get(cacheKey) as Item[];
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

  static async getFastHomePage(): Promise<Item[]> {
    try {
      if (HN.cache.has('__homepage')) {
        return HN.cache.get('__homepage') as Item[];
      }

      const result = await f(`https://hnpwa.com/api/v0/news.json`);

      const items = await result.json();

      const homeItems = items.map((item, i) => {
        item.index = i + 1;
        item.moment = item.time_ago;
        return item;
      });

      HN.cache.set('__homepage', homeItems);

      return homeItems;

    } catch (e) {
      return HN.getItems('top');
    }
  }
}
