class DB {
  db = null;
  //   IDBOpenDBRequest 对象
  DBOpenRequest = null;

  constructor(name, version) {
    Object.assign(this, { name, version });
    this.DBOpenRequest = window.indexedDB.open(name, version);
    this.DBOpenRequest.onupgradeneeded = this.onupgradeneeded.bind(this);
  }
  onReady() {
    return new Promise((resolve, reject) => {
      // request.onsuccess会返回一个Event
      // Event.target.result是一个IDBDatabase对象, 正好跟this.DBOpenRequest.result返回的是同一个东西

      this.DBOpenRequest.onsuccess = e => {
        this.onsuccess.call(this);
        resolve();
      };

      this.DBOpenRequest.onerror = () => {
        this.onerror.call(this);
        reject();
      };
    });
  }

  onsuccess() {
    this.db = this.DBOpenRequest.result;
    console.log("---success---");
  }

  // 该事件只会在新建数据库或者版本变动时执行
  // 只执行一次
  onupgradeneeded(evt) {
    // evt.target.result是一个IDBDatabase对象, 该对象可操作indexdb数据库, 常用的操作是用该对象创建字段
    this.db = evt.target.result;
    const { name, db } = this;
    if (!db.objectStoreNames.contains(name)) {
      const objectStore = db.createObjectStore("info", {
        keyPath: "id",
        autoIncrement: true
      });
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("name", "name");
      objectStore.createIndex("province", "province");
      objectStore.createIndex("address", "address");
      objectStore.createIndex("birthDate", "birthDate");

      objectStore.createIndex("remark", "remark");
    }

    console.log("---onupgradeneeded---");
  }

  onerror() {}

  // 对数据库进行操作时 需要先获取到IDBDatabase对象
  add(item) {
    this.db = this.DBOpenRequest.result;

    const request = this.objectStore.add(item);
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  delete(id) {
    this.db = this.DBOpenRequest.result;

    const request = this.objectStore.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  readAll() {
    const request = this.objectStore.openCursor();

    const list = [];

    return new Promise((resolve, reject) => {
      request.onsuccess = evt => {
        const cursor = evt.target.result;

        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
        } else {
          resolve(list);
        }
      };

      request.onerror = reject;
    });
  }

  //   IDBObjectStore 可以对数据对象进行操作
  //   IDBObjectStore属于IDBDatabase对象下的transaction(事务)
  get objectStore() {
    if (!this.db) {
      return;
    }

    const transaction = this.db.transaction(
      this.db.objectStoreNames,
      "readwrite"
    );
    return transaction.objectStore("info");
  }
}

export default function useDatabaseModel(name, version) {
  return new DB(name, version);
}
