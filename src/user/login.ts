import { objectModel } from "../database/model"
import { v4 as uuidv4 } from "uuid"
import admin from '../firebase/connection'

export const login = async (email: string) => {
    
    try {
        const checkUser = await checkForUser(email)
        return checkUser
    }
    catch(err) {
        return false
    }

}

const checkForUser = async (email: string) => {
    try {
        const checkEmail = await admin.auth().getUserByEmail(email)
        return true
    }
    catch(err) {
        return false
    }
}