import { objectModel } from "../database/model"

export const move = async (parent: string | null, name: string, object_id: string, owner: string) => {    
    try {
        const checkObjectExists = await checkifObjectExists(object_id, owner)
        if (checkObjectExists) {
            const checkDoubleNames = await checkForDoubleNames(parent, name, owner)
            if (checkDoubleNames) {
                const modifyObject = await modifyTheObject(parent, name, object_id, owner)
                if (modifyObject) return true
                return false
            }
            return false
        }
        return false
    }
    catch(err) {
        return false
    }
}

const modifyTheObject = async (parent: string | null, name: string, uuid: string, owner: string) => {
    try {
        const response = await objectModel.updateOne({
            uuid,
            owner
        },
        {
            parent,
            name
        })
        if (response) return true
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const checkifObjectExists = async (object_id: string, owner: string) => {
    try {
        const response = await objectModel.findOne({ object_id, owner })
        if (response === null) return true
        return false
    }
    catch(err) {
        return false
    }
}

const checkForDoubleNames = async ( parent: string | null, name: string, owner: string) => {
    try {
        const response = await objectModel.findOne({ parent, name, owner })
        if(!response) return true
        return false
    }
    catch(err) {
        return false
    }
}

