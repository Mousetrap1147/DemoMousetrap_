"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("app.get('/')");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
