"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(String(process.env.DATABASE_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.default = mongoose_1.default;
