import pdf from "pdf-parse"
import fs from "fs"

export const PdfClassifier = async (path: string) => {
    try {
        const file = fs.readFileSync(path)
        const response = await pdf(file)
        return response.text
    }
    catch(err) {
        console.log(err)
        return false
    }
}