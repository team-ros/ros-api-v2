import { objectModel, Iobject } from "../database/model"
import minioClient from "./connection"

export const get = async (object_id: string | null, owner: string) => {

    try {
        // Directory Listing on Root
        if(!object_id) {
            const rootDirectoryListing = await DirectoryListing(null, owner)
            return {
                status: true,
                listing: rootDirectoryListing
            }
        }
        const uuid = object_id

        const databaseResult = await FetchFromDatabase(uuid, owner)

        if(databaseResult) {

            // Directory Listing
            if(!databaseResult.type) {
                let listingResponse = await DirectoryListing(uuid, owner)
                return {
                    status: true,
                    listing: listingResponse
                }
            }

            // Get File URL
            if(databaseResult.type) {
                const fileURL = await GetFileURL(uuid)
                return {
                    status: true,
                    url: fileURL
                }
            }

        }

        return {
            status: false,
            msg: "object does not exist"
        }

    }
    catch(err) {

        return {
            status: false,
            debug: err
        }

    }

}

const FetchFromDatabase = async (uuid: string, owner: string) => {
    try {
        const response = await objectModel.findOne({ uuid, owner })
        if(response) return response
        return false
    }
    catch(err) {
        console.log(err)
        return false
    }
}   

const DirectoryListing = async (parent: string | null, owner: string) => {
    try {
        const response = await objectModel.find({ parent, owner })
        console.log(response)
        if(response === []) return response
        return DirectoryListingSerializer(response)
    }
    catch(err) {
        console.log(err)
        return err
    }
}

const DirectoryListingSerializer = (listing: Iobject[] ) => {
    return listing.map((value) => {
        return {
            id: value.uuid,
            name: value.name,
            parent: value.parent,
            type: value.type ? "file" : "directory",
            size: value.type ? value.file_size : null,
            date: value.created_at
        }
    })
}

const GetFileURL = async (uuid: string) => {
    try {
        const presignedURL = await minioClient.presignedGetObject((process.env.HEROKU_DEV ? String(process.env.S3_BUCKET) : "ros"), uuid, 24*60*60)
        return presignedURL
    }
    catch(err) {
        console.log(err)
        return false
    }
}

