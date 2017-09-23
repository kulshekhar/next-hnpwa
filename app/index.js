"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_1 = require("firebase-functions");
const express = require("express");
const next = require("next");
const routes_1 = require("./server/routes");
const db_1 = require("./server/db");
const nxt = next({ dev: false, conf: { distDir: 'next' } });
if (nxt) { }
const handle = nxt.getRequestHandler();
const app = express();
let nextPrepared = false;
module.exports = {
    fbapp: firebase_functions_1.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
        if (nextPrepared === false) {
            console.log('>> preparing next');
            yield db_1.HN.initialize();
            yield nxt.prepare();
            app.use('/', routes_1.routes({ app: nxt }));
            app.get('*', (req, res) => handle(req, res));
            nextPrepared = true;
        }
        return app(req, res);
    }))
};
// module.exports = {
//   fbapp: https.onRequest(async (req, res) => {
//     res.send('Hello there');
//   })
// };
