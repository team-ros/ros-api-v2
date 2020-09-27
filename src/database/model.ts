import mongoose from "./connection"
import { Schema, Document } from "mongoose"
import { v4 as uuidv4 } from 'uuid'

interface Iobject extends Document {
    uuid: string
    name: string
    parent?: string
    type: string
    owner: string
}

const objectSchema = new Schema({

    // object id
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true,
        default: uuidv4()
    },

    // object name
    name: {
        type: String,
        required: true
    },

    // parent object
    parent: {
        type: String,
        index: true
    },

    // file type
    type: {
        type: Boolean,
        required: true,
        index: true
    },

    // owner id
    owner: {
        type: String,
        required: true,
        index: true
    }

})

export const objectModel = mongoose.model<Iobject>("object", objectSchema)

