// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

import { Copy } from "../../fileSystem/copy"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.post("/",
    body("object_id").isString().notEmpty(),
    body("parent").isUUID().optional({ nullable: true }),
    body("name").isString(),
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

        const name: string = req.body.name
        const parent: string | null = req.body.parent || null
        const user: string = req.user.sub
        const uuid = req.body.object_id

        try {
            const response = await Copy(parent, uuid, user, name)
            res.json({ status: response })
        }
        catch (err) {
            console.log(err)

            res.json({
                status: false,
                debug: err
            })
        }

    }
)



export default router