// initialize express router instance
import express from "express"
const router = express.Router()

// import express validator
const { body, validationResult } = require('express-validator');

import { objectModel } from "../../database/model"

router.post("/", (req, res) => {

    const parent: string | null = req.body.parent || null
    const name: string = req.body.name

    let nameError: "missing" | "already exists" | "invalid" | null
    let parentError: "does not exist" | null

    // Directory gets created in root
    if(parent === null) {
        
    }

    if(name === null) {
        nameError = "missing"
    }


})