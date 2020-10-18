import { Client } from "@elastic/elasticsearch"
export const elasticClient = new Client({ node: String(process.env.ELASTIC_URL) })