import { database, app, apps, initializeApp } from 'firebase';
import { Item } from './types';

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

    return items;
  }

  static async getItem(id: number): Promise<Item> {
    return null
  }
}
