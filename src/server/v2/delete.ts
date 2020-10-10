// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

import { deleteObj } from "../../fileSystem/deleteObj"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.post("/",
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


        const object_id: string = req.body.object_id
        const user_id: string = req.user.sub

        try {
            const result = await deleteObj(object_id, user_id)

            res.json({
                status: true,
                delete: result
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