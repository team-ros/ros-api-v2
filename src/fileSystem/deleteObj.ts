import { objectModel } from "../database/model"
import minioClient from "./connection"

export const deleteObj = async (object_id: string, owner: string) => {    
    try {
        const checkObjectExists = await checkIfObjectExists(object_id, owner)
        if(checkObjectExists === "dir") {
            const children = await checkForChildren(object_id, owner)
            if(children) {
                children[0].descendants.forEach(async (value: any) => {
                    await deleteSingleObject(value.uuid)
                });
                await deleteSingleObject(object_id)
                return true
            }
        }
        if(checkObjectExists === "file") {

        }
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const checkIfObjectExists = async (object_id: string, owner: string) => {
    try {
        const result = await objectModel.findOne({ uuid: object_id, owner})
        if (result !== null) {
            if(result.type === true) return "file"
            return "dir"
        }
        else {
            console.log("CheckIfObjectExists", result)
            return false
        }
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const deleteSingleObject = async (uuid: string): Promise<void> => {
    try {
        const databaseDelete = await objectModel.remove({ uuid })
        const s3Delete = await minioClient.removeObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), uuid)
    }
    catch(err) {
        console.log(err)
    }
}

const checkForChildren = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.aggregate([
            { $match: { uuid }},
            { 
                $graphLookup: {
                    from: 'objects',
                    startWith: "$uuid",
                    connectFromField: "uuid",
                    connectToField: "parent",
                    as: 'descendants'
                }
            },
        ])
        console.log(response)
        console.log(JSON.stringify(response))
        return response
    }
    catch(err) {
        console.log(err)
        return false
    }
}




