// checking for environment variables
if(process.env.HEROKU_DEV) {
    if(!process.env.S3_BUCKET) throw "ERR 008; No S3 Bucket specified"
    if(!process.env.S3_REGION) throw "ERR 009; No S3 Region specified"
}

if(!process.env.DATABASE_URL) throw "ERR 001; Database connection string not set"
if(!/^mongodb(\+srv)?:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/.test(process.env.DATABASE_URL)) throw "ERR 002; Database connection string invalid"

if(!process.env.FIREBASE) throw "ERR 003; No Base64 encoded Firebase Key set"

if(!process.env.S3_ACCESS_KEY) throw "ERR 004; No S3 Access Key defined"

if(!process.env.S3_SECRET_KEY) throw "ERR 005; No S3 Secret Key defined"

if(!process.env.S3_ENDPOINT) throw "ERR 006; No S3 Endpoint defined"

if(!process.env.HEROKU_DEV) {
    if(!process.env.S3_PORT) throw "ERR 007; No S3 Port defined"
}

import "./server"