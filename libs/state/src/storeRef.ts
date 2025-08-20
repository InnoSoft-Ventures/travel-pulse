import type { AppStore } from './store';

class StoreRef {
  private _store: AppStore | null = null;

  set(store: AppStore) {
    this._store = store;
  }

  get(): AppStore | null {
    return this._store;
  }
}

export const storeRef = new StoreRef();
