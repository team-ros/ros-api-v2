import { objectModel } from "../database/model"
import { v4 as uuidv4 } from "uuid"
import minioClient from "./connection"
import fs from "fs"
import { Indexer } from "../search/indexer"

export const uploader = async (payload: Express.Multer.File, parent: string | null, owner: string, name: string | null) => {

    const path = payload.path
    const mime = payload.mimetype
    const fileSize = payload.size
    const fileName: string = uuidv4()

    try {
        const dubbleNameResponse = await CheckDubbleNames(parent, owner, name || payload.originalname)

        if(!dubbleNameResponse){
            return false
        }

        const classifierResponse = await Classifier(payload.path, payload.mimetype)

        const response = await FileUploader(path, mime, fileName)
        if(response) {
            const databaseResponse = await DatabaseStore(fileName, name || payload.originalname, parent, owner, fileSize)
            if(databaseResponse) {
                const indexResponse = await Indexer({
                    owner,
                    name: name || payload.originalname,
                    id: fileName,
                    file_type: payload.mimetype,
                    file_size: payload.size,
                    created_at: Date.now(),
                    text: classifierResponse ? String(classifierResponse) : undefined
                })
                if(!indexResponse) console.log("could not index file")
                return true
            }
            return false

        }
        return false
    }
    catch(err) {
        return false
    }
}

const FileUploader = async (path: string, mime: string, fileName: string) => {

    try {
        const response = await minioClient.fPutObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), fileName, path, {
            'Content-Type': mime
        })
        return true
    }
    catch(err) {
        console.log(err)
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
        if(response) return false
        return true
    }
    catch(err) {
        return false
    }
}

import { ImageClassifier } from "../search/image_classifier"
import { PdfClassifier } from "../search/pdf_classifier"

const Classifier = async (path: string, mime: string) => {
    try {

        // image classifier
        if(mime.startsWith("image")) {
            const response = await ImageClassifier(path)
            if(response) return response
        }

        // pdf classifier
        if(mime === "application/pdf") {
            const response = await PdfClassifier(path)
            if(response) return response
        }
        return true
    }
    catch(err) {
        console.log(err)
        return false
    }
}