import { database, app, apps, initializeApp } from 'firebase';
import { Item, User } from './types';
import * as moment from 'moment';

export class HN {
  private static domain = 'https://hacker-news.firebaseio.com';
  private static version = 'v0';
  private static app: app.App;

  private static ref: database.Reference;

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

  static async getItems(pathname: string, page: number = 1): Promise<Item[]> {
    const limit = 30;
    const offset = (page - 1) * limit;

    const itemsSnapshot = await HN.ref.child(`${pathname}stories`)
      .limitToFirst(limit * page)
      .once('value');

    const itemIds: number[] = itemsSnapshot.val().slice(offset, offset + limit);

    const promises: Promise<Item>[] = itemIds.map(async id => {
      const snapshot = await HN.ref.child(`item/${id}`).once('value');
      return snapshot.val();
    });

    const items = await Promise.all(promises);

    return items.map((item, i) => {
      if (item.url) {
        const parts = item.url.split('/');
        if (parts.length > 1) {
          item.domain = parts[2];
        }
      }
      if (item.time) {
        item.moment = moment.unix(item.time).from(moment(new Date()));
      }
      item.index = offset + i + 1;
      return item;
    });
  }

  static async getItem(id: number): Promise<Item> {
    return null
  }

  static async getUser(id: string): Promise<User> {
    const snapshot = await HN.ref.child(`user/${id}`).once('value');
    return snapshot.val();
  }
}
