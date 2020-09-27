"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectModel = void 0;
const connection_1 = __importDefault(require("./connection"));
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const objectSchema = new mongoose_1.Schema({
    // object id
    uuid: {
        type: String,
        required: true,
        index: true,
        unique: true,
        default: uuid_1.v4()
    },
    // object name
    name: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        index: true
    },
    type: {
        type: Boolean,
        required: true,
        index: true
    },
    owner: {
        type: String,
        required: true,
        index: true
    }
});
exports.objectModel = connection_1.default.model("object", objectSchema);
