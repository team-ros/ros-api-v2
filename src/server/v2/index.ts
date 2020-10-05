// initialize router instance
import express from "express"
const router = express.Router()

// import routes
import createDir from "./create_dir"
import upload from "./upload"
import get from "./get"

router.use("/create_dir", createDir)
router.use("/upload", upload)
router.use("/get", get)

export default router