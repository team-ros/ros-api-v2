// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

import multer from "multer"
const upload = multer({ dest: "/tmp" })

import { uploader } from "../../fileSystem/upload"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.put("/",
    query("parent").isUUID().optional(),
    upload.single("file"),
    async (req: AuthenticatedRequest, res) => {

        // return any errors from validation
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return (
                res.status(400)
                    .json({
                        status: false, errors: errors.array()
                    })
            )
        }

        const file = req.file
        const parent: any = req.query.parent || null
        const owner: string = req.user.sub

        try {
            const response = await uploader(file, parent, owner)

            res.json({
                status: response
            })
        }
        catch(err) {
            console.log(err)
            res.json({
                status: false,
                debug: err
            })
        }

    }
)

export default router