import { objectModel, Iobject } from "../database/model"
import minioClient from "../fileSystem/connection"
import admin from "../firebase/connection"

export const deleteUser = async (owner: string) => {
    
    try {
        const allUserObjects = await getAllUserObjects(owner) 
        if(allUserObjects) {
            const deleteEverything = await deleteAllUserObjects(allUserObjects, owner)
            if(deleteEverything) {
                const deleteAccount = await deleteUserFromFirebase(owner)
                if(deleteAccount) return true
                return false
            }
            return false
        }
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }

}

const getAllUserObjects = async (owner: string) => {
    try {
        const response = await objectModel.find({ owner })
        return response
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const deleteAllUserObjects = async (objects: Iobject[], owner: string) => {
    try {
        const objectArray = serializeObjectsForMinio(objects)
        await minioClient.removeObjects((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), objectArray)
        await objectModel.deleteMany({ owner })
        return true
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const serializeObjectsForMinio = (objects: Iobject[]) => {
    return objects.map(value => {
        return value.uuid
    })
}

const deleteUserFromFirebase = async (owner: string) => {
    try {
        await admin.auth().deleteUser(owner)
        return true
    }
    catch(err) {
        console.log(err)
        return false
    }
}
