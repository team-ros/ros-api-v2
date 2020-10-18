import { elasticClient } from "./connection"

interface Iindexer {
    owner: string
    name: string
    id: string
    file_type: string
    file_size: number
    created_at: number
    text?: string | null
}

export const Indexer = async (options: Iindexer) => {
    try {
        await elasticClient.index({
            index: "roscloud",
            body: options
        })
        return true
    }
    catch(err) {
        console.log(err)
        return false
    }
}