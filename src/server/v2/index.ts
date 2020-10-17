// initialize router instance
import express from "express"
const router = express.Router()

// import routes
import createDir from "./create_dir"
import upload from "./upload"
import get from "./get"
import move from "./move"
import deleteObj from "./delete"
import deleteUser from "./delete_user"
import copy from "./copy"

router.use("/create_dir", createDir)
router.use("/upload", upload)
router.use("/get", get)
router.use("/move", move)
router.use("/delete", deleteObj)
router.use("/delete_user", deleteUser)
router.use("/copy", copy)

export default router