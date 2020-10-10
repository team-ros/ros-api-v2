// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

import { get } from "../../fileSystem/get"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.get("/",
    query("object_id").isUUID().optional({ nullable: true }),
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

        const object_id: any = req.query.object_id
        const owner: string = req.user.sub

        try {
            const response = await get(object_id, owner)
            res.json(response)
        }
        catch(err) {
            res.json({
                status: false,
                debug: err
            })
        }
})

export default router