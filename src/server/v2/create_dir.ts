// initialize express router instance
import express, { Request, Response } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

import { createDir } from "../../fileSystem/create_dir"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.post("/",
    body("name").isString().notEmpty(),
    body("parent").isUUID().optional(),
    async (req: AuthenticatedRequest, res: Response) => {
        // return any errors from validation
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() })
        }
    
        const name: string = req.body.name
        const parent: string | null = req.body.parent || null
        const user: string = req.user.sub
    
        try {
            const result = await createDir(parent, name, user)
            res.send(result)
        }
        catch(err) {
            console.log(err)
        }
        
    }
)



export default router