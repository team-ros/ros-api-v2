import { elasticClient } from "./connection"

/* NEEDS WORK
{
  root_cause: [
    {
      type: 'parsing_exception',
      reason: '[should] query malformed, no start_object after query name',
      line: 1,
      col: 37
    }
  ],
  type: 'x_content_parse_exception',
  reason: '[1:37] [bool] failed to parse field [must]',
  caused_by: {
    type: 'parsing_exception',
    reason: '[should] query malformed, no start_object after query name',
    line: 1,
    col: 37
  }
}

*/

interface Isearch {
    search: string
    file_type?: string | null
    file_size?: number | null
    created_at?: number | null
    owner: string
}

export const Search = async (options: Isearch) => {
    try {
        await elasticClient.indices.refresh({ index: 'roscloud' })
        const query = await elasticClient.search({
            index: "roscloud",
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                should: [
                                    {
                                        match: {
                                            text: `.*${options.search}.*`
                                        }
                                    },
                                    {
                                        match: {
                                            name: `.*${options.search}.*`
                                        }
                                    }
                                ]
                            },
                            {
                                match: { 
                                    owner: options.owner,
                                    file_type: options.file_type ? options.file_type : undefined,
                                    file_size: options.file_size ? options.file_size : undefined,
                                    created_at: options.created_at ? options.created_at : undefined
                                }
                            }
                        ]
                    }
                }
            }
        })
        console.log("nothing found")
        console.log("body", query)
        return query
    }
    catch(err) {
        console.log(err.meta.body.error)
    }
}