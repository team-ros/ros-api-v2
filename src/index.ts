// checking for environment variables
import "dotenv/config"
import fs from "fs"

if(!process.env.DATABASE_URL) throw "ERR 001; Database connection string not set"
if(!/^mongodb(\+srv)?:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/.test(process.env.DATABASE_URL)) throw "ERR 002; Database connection string invalid"

if(!process.env.CERT) throw "ERR 003; No Base64 encoded Public Key Certificate set"

if(!process.env.S3_ACCESS_KEY) throw "ERR 004; No S3 Access Key defined"

if(!process.env.S3_SECRET_KEY) throw "ERR 005; No S3 Secret Key defined"

if(!process.env.S3_ENDPOINT) throw "ERR 006; No S3 Endpoint defined"

import "./server"