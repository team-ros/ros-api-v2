import { objectModel } from "../database/model"
import minioClient from "./connection"

export const deleteObj = async (object_id: string, owner: string) => {    
    try {
        // const checkObjectExists = await checkIfObjectExists(object_id, owner)
        // if(checkObjectExists) {
        //     const children = await checkForChildren(object_id, owner)
        //     console.log(children)
        // }
        // return false
        await checkForChildren(object_id, owner)
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const checkIfObjectExists = async (object_id: string, owner: string) => {
    try {
        const result = await objectModel.findOne({ uuid: object_id, owner})
        if (result) return true
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const checkForChildren = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.aggregate([
            { $match: { owner }},
            { 
                $graphLookup: {
                    from: "object",
                    startWith: "$parent",
                    connectFromField: "parent",
                    connectToField: "uuid",
                    as: "subdirectories"
                } 
            }
        ])
        console.log(response)
        return response
    }
    catch(err) {
        console.log(err)
        return false
    }
}




