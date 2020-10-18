// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { query, validationResult } from "express-validator"

import { Search } from "../../search/search"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.get("/",
    query("search").isString().notEmpty(),
    query("file_type").isString().optional({ nullable: true }),
    query("file_size").isString().optional({ nullable: true }),
    query("created_at").isNumeric().optional({ nullable: true }),
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

        const search: any = req.query.search
        const file_type: any = req.query.file_type || null
        const file_size: any = req.query.file_size || null
        const created_at: any = req.query.created_at || null
        const owner: string = req.user.sub

        

        try {
            const response = await Search({
                search,
                file_type,
                file_size,
                created_at,
                owner
            })
            console.log("response", response)
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