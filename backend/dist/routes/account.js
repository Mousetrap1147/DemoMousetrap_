"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const HttpError_1 = __importDefault(require("../HttpError"));
const passport_1 = __importDefault(require("passport"));
const passport_http_1 = require("passport-http");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
const verifyFunction = function (username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        function checkPassword(password, storedHash, salt) {
            const hashedPassword = crypto_1.default.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
            return hashedPassword === storedHash;
        }
        try {
            const account = yield prisma.account.findUnique({
                where: {
                    username: username,
                },
            });
            if (!account) {
                return done(null, false, { message: 'No such account found' });
            }
            if (account.password_hash !== null && account.password_salt !== null) {
                const passwordIsValid = checkPassword(password, account.password_hash, account.password_salt);
                if (!passwordIsValid) {
                    return done(null, false, { message: 'Invalid password' });
                }
            }
            return done(null, account);
        }
        catch (error) {
            return done(error);
        }
    });
};
passport_1.default.use(new BasicStrategyModified({}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield prisma.account.findUnique({
            where: { username: username },
        });
        if (!account) {
            return done(null, false);
        }
        if (account.password_salt !== null) {
            crypto_1.default.pbkdf2(password, account.password_salt, 10000, 64, 'sha512', (err, derivedKey) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return done(err);
                }
                const hash = derivedKey.toString('base64');
                if (hash !== account.password_hash) {
                    return done(null, false);
                }
                return done(null, account);
            }));
        }
    }
    catch (err) {
        done(err);
    }
})));
router.post('/login', passport_1.default.authenticate('basic', { session: false }), (req, res, next) => {
    if (req.user) {
        if ('id' in req.user && 'username' in req.user) {
            const accountDetails = {
                id: req.user.id,
                username: req.user.username
            };
            res.send(accountDetails);
        }
    }
    else {
        res.sendStatus(401);
    }
});
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || req.body.username === '') {
        return next(new HttpError_1.default(400, 'Propriété username manquante'));
    }
    if (!req.body.password || req.body.password === '') {
        return next(new HttpError_1.default(400, 'Propriété password manquante'));
    }
    const saltBuffer = crypto_1.default.randomBytes(16);
    const salt = saltBuffer.toString('base64');
    crypto_1.default.pbkdf2(req.body.password, salt, 10000, 64, 'sha512', (err, derivedKey) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        const hash = derivedKey.toString('base64');
        try {
            const account = yield prisma.account.create({
                data: {
                    username: req.body.username,
                    password_hash: hash,
                    password_salt: salt
                }
            });
            res.send(account);
        }
        catch (err) {
            next(err);
        }
    }));
}));
exports.default = router;
