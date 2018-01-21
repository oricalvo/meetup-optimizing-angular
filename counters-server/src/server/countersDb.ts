import {Database} from 'sqlite3';
import {Counter} from '../common/counter';

export class CountersDb {
  db: Database;

  constructor(private dbFilePath: string) {
  }

  open(): Promise<void> {
    if(this.db) {
      return Promise.resolve();
    }

    return new Promise((resolve,reject)=> {
      this.db = new Database(this.dbFilePath, function (err) {
        if(err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  close() {
    if(!this.db) {
      return;
    }

    this.db.close();
    this.db = null;
  }

  getAll(): Promise<Counter[]> {
    return new Promise((resolve,reject)=> {
      const counters = [];

      this.db.all("SELECT * FROM counters", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      })
    });
  }

  run(query, args) {
    return new Promise((resolve, reject) => {
      this.db.run(query, args, function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}
