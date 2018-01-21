import * as express from "express";
import {CountersDb} from './countersDb';
import * as path from 'path';
import {Counter} from '../common/counter';
import * as bodyParser from "body-parser";
import * as cors from "cors";

const app = express();

let counters: {[name: string]: Counter} = {};

app.use(cors());

app.use(bodyParser.json());

app.get("/api/counter", async function(req, res) {
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
});

app.post("/api/counter", async function(req, res) {
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
});

app.listen(3000, function() {
  console.log("Server is running");
});
