// initialize router instance
import express from "express"
const router = express.Router()

// import routes
import createDir from "./create_dir"

router.use("/create_dir", createDir)

export default router