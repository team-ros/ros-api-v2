import { objectModel } from "../database/model"
import minioClient from "./connection"
import { CopyConditions } from "minio"
import { v4 as uuidv4 } from "uuid"

export const Copy = async (parent: string | null, uuid: string, owner: string, name: string) => {
    try {
        const objectResponse = await DetermineIfObjectIsFileOrDirectory(uuid)
        if(objectResponse !== false) {

            // Directory
            if(objectResponse.type === false) {
                const recreateDir = await RecreateMainObjectDir(name, uuid, parent, owner)
                if(recreateDir) return true
                return false
            }
            // File
            if(objectResponse.type === true) {
                const recreateFile = await RecreateMainObjectFile(name, uuid, parent, owner, objectResponse.file_size)
                if(recreateFile) return true
                return false
            }
        }
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}

const RecreateMainObjectFile = async (name: string, uuid: string, parent: string | null, owner: string, file_size?: number) => {
    try {
        const newObjectUUID = uuidv4()
        const conds = new CopyConditions()
        const copyResponse = await minioClient.copyObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), newObjectUUID, `/${(process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros")}/${uuid}`, conds)
        console.log("CopyResponse", copyResponse)
        const databaseResponse = await objectModel.create({ uuid: newObjectUUID, parent, name, owner, type: true, file_size })
        return true
    }
    catch(err) {
        return false
    }
}

const RecreateMainObjectDir = async (name: string, uuid: string, parent: string | null, owner: string) => {
    try {
        const newObjectUUID = uuidv4()
        const copyRootObject = await objectModel.create({ uuid: newObjectUUID, type: false, parent, name, owner })
        const children = await objectModel.find({ parent: uuid, owner })
        for(const child of children) {
            console.log("child", child)
            if(child.type === true) {
                await CopyFile(child.uuid, newObjectUUID, owner)
            }
            if(child.type === false ) {
                await CopyDir(child.uuid, newObjectUUID, owner)
            }
        }
        return true
    }
    catch(err) {
        console.log(err)
    }
}

const CopyDir = async (original_uuid: string, copyTo_uuid: string, owner: string) => {

    const newUUID = uuidv4()
    console.log("newdiruuuid", newUUID)
    try {
        const getDir = await objectModel.findOne({ uuid: original_uuid, owner })
        if(getDir) {
            const copy = await objectModel.create({ uuid: newUUID, name: getDir.name, type: false, parent: copyTo_uuid, owner })
            const getChildren = await objectModel.find({ parent: original_uuid, owner })
            for(const child of getChildren) {
                if(child.type === false) {
                    await CopyDir(child.uuid, newUUID, owner)
                }
                if(child.type === true) {
                    await CopyFile(child.uuid, newUUID, owner)
                }
            }
        }
    }
    catch(err) {
        console.log(err)
    }
}

const CopyFile = async (original_uuid: string, copyTo_uuid: string, owner: string) => {
    try {
        const newUUID = uuidv4()
        const getOriginal = await objectModel.findOne({ uuid: original_uuid, owner })
        console.log("getOriginal", getOriginal)
        if(getOriginal) {
            const copy = await objectModel.create({ uuid: newUUID, name: getOriginal.name, owner, file_size: getOriginal.file_size, parent: copyTo_uuid, type: true })
            const conds = new CopyConditions()
            await minioClient.copyObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), newUUID, `/${(process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros")}/${original_uuid}`, conds)
        }
    }
    catch(err) {
        console.log(err)
    }
}

const DetermineIfObjectIsFileOrDirectory = async (uuid: string) => {
    try {
        const response = await objectModel.findOne({ uuid })
        if(response === null) return false
        return response
    }
    catch(err) {
        console.log(err)
        return false
    }
}

