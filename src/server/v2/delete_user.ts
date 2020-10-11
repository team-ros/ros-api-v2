// initialize express router instance
import express, { Request } from "express"
const router = express.Router()

import { deleteUser } from "../../user/deleteUser"

interface AuthenticatedRequest extends Request {
    user?: any
}

router.post("/",
    async (req: AuthenticatedRequest, res) => {

        const user_id: string = req.user.sub

        try {
            const result = await deleteUser(user_id)

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