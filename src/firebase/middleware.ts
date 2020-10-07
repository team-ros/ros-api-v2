import { Request, Response, NextFunction } from "express"
import admin from "./connection"

interface IRequest extends Request {
    user?: any
}


export const authMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {

    if(!req.headers.authorization) return res.status(403).json({
        status: false,
        message: "unauthorized"
    })

    if(!/Bearer .*/.test(req.headers.authorization)) return res.status(403).json({
        status: false,
        message: "malformed access token"
    })

    const token: string = req.headers.authorization.replace("Bearer ", "")

    try {
        const tokenResponse = await admin.auth().verifyIdToken(token)
        req.user = {
            sub: tokenResponse.uid
        }
        next()
    }
    catch(err) {
        res.status(403).json({
            status: false,
            message: "access token not valid",
        })
    }

}