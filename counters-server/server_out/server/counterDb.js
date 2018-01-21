"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = require("sqlite3");
var CountersDb = /** @class */ (function () {
    function CountersDb(dbFilePath) {
        this.dbFilePath = dbFilePath;
    }
    CountersDb.prototype.open = function () {
        var _this = this;
        if (this.db) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            _this.db = new sqlite3_1.Database(_this.dbFilePath, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    };
    CountersDb.prototype.close = function () {
        if (!this.db) {
            return;
        }
        this.db.close();
        this.db = null;
    };
    CountersDb.prototype.getAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var counters = [];
            _this.db.all("SELECT * FROM counters", function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    };
    return CountersDb;
}());
exports.CountersDb = CountersDb;
//# sourceMappingURL=counterDb.js.map