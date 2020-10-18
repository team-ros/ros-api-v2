/*
    This file includes code that has no Type-Declarations. 
    It is copied from a prior version and should theoretically work so please do not mess with it.
*/
import { node } from "@tensorflow/tfjs-node"
import { load } from "@tensorflow-models/coco-ssd"
import { promises, readFileSync } from "fs"

// import module without type declarations
const translatte: any = require("translatte")


export const ImageClassifier = async (path: string): Promise<string | boolean> => {
    return new Promise(data => {
        Promise.all([load(), readFileSync(path)])
        .then((results) => {
            console.log("cocoSsd-Result", results)
            // First result is the COCO-SSD model object.
            const model = results[0];
            // Second result is image buffer.
            const imgTensor: any = node.decodeImage(new Uint8Array(results[1]), 3);
            // Call detect() to run inference.
            return model.detect(imgTensor);
        })
        .then(predictions => {
            let results = predictions
            let resultValues = []
            for (let value of results) {
                resultValues.push(value.class)
            }
            let count: any = {};
            resultValues.forEach(function (i) { count[i] = (count[i] || 0) + 1; });
            let countString = ""
            for (let i in count) {
                countString += count[i] + " " + i + " "
            }
            translatte(countString, { to: "de" })
            .then((response: any) => {
                console.log(response.text)
                data(response.text)
            })
            .catch((err: any) => {
                console.log(err)
                data(false)
            })
        })
    })
}