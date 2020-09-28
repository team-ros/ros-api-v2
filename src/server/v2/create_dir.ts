// initialize express router instance
import express, { Request, Response } from "express"
const router = express.Router()

import { body, validationResult } from "express-validator"

import { objectModel } from "../../database/model"

import { v4 as uuidv4 } from "uuid"

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
            const isUnique = await checkForDubbleNames(name, parent)
            if(isUnique) {
                const response = await createDir(name, parent, user)
                return res.json({
                    status: true,
                    data: {
                        type: "dir",
                        id: response.uuid
                    }
                })
            }
            return res.json({
                status: false,
                request: {
                    name: "already exists",
                    parent: true
                }
            })
        }
        catch(err) {
            return res.json({
                status: false,
                debug: err
            })
        }
    }
)

// checks if a name already exists in this directory
const checkForDubbleNames = async (name: string, parent: string | null) => {
    const respone = await objectModel.findOne({ parent, name })
    if(!respone) return true
    return false
}

// creates directory
const createDir = async (name: string, parent: string | null, owner: string) => {
    return await objectModel.create({
        name,
        parent,
        type: false,
        owner,
        uuid: uuidv4()
    })
}

export default router