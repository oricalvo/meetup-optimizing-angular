import {Application} from 'express';
import {CountersDb} from './countersDb';
import * as path from 'path';
import {counters} from './counters';

export function registerApi(app: Application) {
  app.get("/api/counter", getAll);
  app.post("/api/counter", updateMany);
}

async function getAll(req, res) {
  let db = null;
  try {
    db = new CountersDb(path.join(__dirname, "../counters.db"));
    await db.open();

    //const counters: Counter[] = await db.getAll();
    const c = [];
    for(const key in counters) {
      c.push(counters[key]);
    }

    res.json(c);
  }
  catch(err) {
    res.statusCode = 500;
    res.statusMessage = err.message;
    res.end();
  }
  finally {
    if(db) {
      db.close();
    }
  }
}

async function updateMany(req, res) {
  let db = null;
  try {
    db = new CountersDb(path.join(__dirname, "../counters.db"));
    await db.open();

    const newCounters = req.body;
    if(Array.isArray(newCounters)) {
      for(const counter of newCounters) {
        //await db.run("INSERT OR REPLACE INTO counters (name, value) VALUES (?, ?);", [counter.name, counter.value]);
        counters[counter.name] = counter;
      }
      //counters = counters.concat(newCounters);
    }
    else {
      counters[newCounters.name] = newCounters;
      //counters.push();
      //await db.run("INSERT OR REPLACE INTO counters (name, value) VALUES (?, ?);", [counters.name, counters.value]);
    }

    res.json({ok: true});
  }
  catch(err) {
    res.statusCode = 500;
    res.statusMessage = err.message;
    res.end();
  }
  finally {
    if(db) {
      db.close();
    }
  }
}
