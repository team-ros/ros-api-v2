import { objectModel } from "../database/model"
import { v4 as uuidv4 } from "uuid"

export const createDir = async (parent: string | null, name: string, owner: string) => {

    const dirName = uuidv4()
    
    try {
        const checkedDubbleNames = await checkForDubbleNames(name, parent, owner)
        if(checkedDubbleNames) {
            const createdDirectory = await createDirectory(name, parent, owner, dirName)
            console.log(createdDirectory)
            return dirName
        }
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }

}

// checks if a name already exists in this directory
const checkForDubbleNames = async (name: string, parent: string | null, owner: string) => {
    const respone = await objectModel.findOne({ parent, name, owner })
    if(!respone) return true
    return false
}

// creates directory
const createDirectory = async (name: string, parent: string | null, owner: string, uuid: string) => {
    return await objectModel.create({
        name,
        parent,
        type: false,
        owner,
        uuid
    })
}
