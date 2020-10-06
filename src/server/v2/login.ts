// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

import { login } from "../../user/login"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.get("/",
    query("email").isString().notEmpty(),
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

        const email: any = req.query.email

        try {
            const result = await login(email)

            res.json({
                status: true,
                exists: result
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