// initializing express instance
import express from "express"
const app = express()

// import middleware
import jwt from "express-jwt"
import cors from "cors"
import bodyParser from "body-parser"

app.get("/health", (req, res) => {
    res.send()
})

// apply middleware
app.use(cors())
app.use(bodyParser.json())
app.use(jwt({
    secret: Buffer.from(String(process.env.CERT), 'base64'),
    algorithms: ['RS256']
}))

// import routes
import v2 from "./v2"

// apply routes
app.use("/v2", v2)

// specify where express listens on
app.listen(process.env.PORT || 8080)