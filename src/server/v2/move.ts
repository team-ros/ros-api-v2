// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

import { move } from "../../fileSystem/move"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.post("/",
    body("parent").isUUID().optional({ nullable: true }),
    body("name").isString().notEmpty(),
    body("object_id").isUUID(),
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

        const parent: string | null = req.body.parent
        const name: string = req.body.name
        const object_id: string = req.body.object_id
        const user_id: string = req.user.sub

        try {
            const result = await move(parent, name, object_id, user_id)

            res.json({
                status: true,
                moved: result
            })
        }
        catch (err) {
            res.json({
                status: false,
                debug: err
            })
        }

    }
)



export default router