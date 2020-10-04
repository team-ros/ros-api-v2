// initialize router instance
import express from "express"
const router = express.Router()

// import routes
import createDir from "./create_dir"
import upload from "./upload"

router.use("/create_dir", createDir)
router.use("/upload", upload)

export default router