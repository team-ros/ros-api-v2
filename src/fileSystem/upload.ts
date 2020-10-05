import { objectModel } from "../database/model"
import { v4 as uuidv4 } from "uuid"
import minioClient from "./connection"

export const uploader = async (payload: Express.Multer.File, parent: string | null, owner: string) => {

    const path = payload.path
    const mime = payload.mimetype
    const fileSize = payload.size
    const fileName: string = uuidv4()

    try {
        const dubbleNameResponse = await CheckDubbleNames(parent, owner, payload.originalname)
        if(!dubbleNameResponse){
            return false
        }

        const response = await FileUploader(path, mime, fileName)
        if(response) {
            const databaseResponse = await DatabaseStore(fileName, payload.originalname, parent, owner, fileSize)
            if(databaseResponse) {
                return true
            }
            return false

        }
        return false
    }
    catch(err) {
        console.log("FileUploadUploader", err)
        return false
    }
}

const FileUploader = async (path: string, mime: string, fileName: string) => {

    try {
        const response = await minioClient.fPutObject("ros", fileName, path, {
            'Content-Type': mime
        })
        return true
    }
    catch(err) {
        console.log("FileUploadUploader", err)
        return false
    }

}

const DatabaseStore = async (uuid: string, name: string, parent: string | null, owner: string, size: number) => {
    try {
        const result = await objectModel.create({
            uuid,
            name,
            parent,
            owner,
            type: true,
            file_size: size
        })
        return result
    }
    catch(err) {
        console.log("FileUploadDatabaseStore", err)
        return false
    }
}

const CheckDubbleNames = async (parent: string | null, owner: string, name: string) => {
    try {
        const response = await objectModel.findOne({
            owner,
            parent,
            name
        })
        console.log("FileUploadDubbleNameResponse", response)
        if(response) return false
        return true
    }
    catch(err) {
        console.log("FileUploadDubbleName", err)
        return false
    }
}


const imageClassifier = () => {

}

const fileClassifier = () => {

}