import { objectModel, Iobject } from "../database/model"

export const get = async (uuid: string, owner: string) => {

    try {
        const databaseResult = await FetchFromDatabase(uuid, owner)

        if(databaseResult) {

            // Directory Listing
            if(!databaseResult.type) {
                let listingResponse = await DirectoryListing(uuid)
                return {
                    status: true,
                    listing: listingResponse
                }
            }

            // Get File URL
            if(databaseResult.type) {

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

const DirectoryListing = async (parent: string) => {
    try {
        const response = await objectModel.find({ parent })
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

const GetFileURL = async (uuid: String) => {

}

