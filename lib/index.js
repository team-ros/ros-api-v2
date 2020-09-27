"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// checking for environment variables
require("dotenv/config");
if (!process.env.DATABASE_URL)
    throw "ERR 001; Database connection string not set";
if (!/^mongodb(\+srv)?:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/.test(process.env.DATABASE_URL))
    throw "ERR 002; Database connection string invalid";
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS)
    throw "ERR 003; GOOGLE_APPLICATION_CREDENTIALS not set";
if (!/^\/([A-z0-9-_+]+\/)*([A-z0-9]+\.(json))$/gm.test(process.env.GOOGLE_APPLICATION_CREDENTIALS))
    throw "ERR 004; GOOGLE_APPLICATION_CREDENTIALS is invalid unix path";
require("./server");
