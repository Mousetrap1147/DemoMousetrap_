"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
const passport_1 = __importDefault(require("passport"));
const passport_http_1 = require("passport-http");
class BasicStrategyModified extends passport_http_1.BasicStrategy {
    constructor(options, verify) {
        super(options, verify);
        this.options = options;
        this.options.realm = options.realm || 'Users';
    }
    _challenge() {
        return 'xBasic realm="' + this.options.realm + '"';
    }
}
const app = (0, express_1.default)();
// User verification function
//TODO: Use database
const verifyFunction = function (username, password, done) {
    if (username === 'user' && password === 'password') {
        return done(null, { username: 'user' });
    }
    else {
        return done(null, false);
    }
};
passport_1.default.use(new BasicStrategyModified({}, verifyFunction));
app.use(passport_1.default.initialize());
//passport example
// app.get('/', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
//   res.send("app.get('/')");
// });
// default REST answer
app.get('/', (req, res) => {
    res.send("app.get('/')");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
