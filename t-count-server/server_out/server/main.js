"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var api_1 = require("./api");
var path = require("path");
var config_1 = require("./config");
var app = express();
app.use(cors());
app.use(bodyParser.json());
if (config_1.default.env == 'prod') {
    var publicPath = path.join(__dirname, "../public");
    console.log("Register static middleware on path " + publicPath);
    app.use(express.static(publicPath));
}
api_1.registerApi(app);
app.listen(3000, function () {
    console.log("Server is running");
});
//# sourceMappingURL=main.js.map