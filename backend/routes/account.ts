import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import HttpError from '../HttpError';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';

const router = Router();
const prisma = new PrismaClient();


class BasicStrategyModified extends BasicStrategy {
    private options: any;

    constructor(options: any, verify: any) {
        super(options, verify);
        this.options = options;
        this.options.realm = options.realm || 'Users';
    }

    _challenge() {
        return 'xBasic realm="' + this.options.realm + '"';
    }
}

const verifyFunction = async function (username: string, password: string, done: any) {

    function checkPassword(password: string, storedHash: string, salt: string): boolean {
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        return hashedPassword === storedHash;
    }

    try {
        const account = await prisma.account.findUnique({
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
    } catch (error) {
        return done(error);
    }
};

passport.use(new BasicStrategyModified({},
    async (username: string, password: string, done: any) => {
        try {
            const account = await prisma.account.findUnique({
                where: { username: username },
            });

            if (!account) {
                return done(null, false);
            }

            if (account.password_salt !== null) {
                crypto.pbkdf2(password, account.password_salt, 10000, 64, 'sha512', async (err, derivedKey) => {
                    if (err) {
                        return done(err);
                    }

                    const hash = derivedKey.toString('base64');

                    if (hash !== account.password_hash) {
                        return done(null, false);
                    }

                    return done(null, account);
                });
            }

        } catch (err) {
            done(err);
        }
    }
));

router.post('/login', passport.authenticate('basic', { session: false }), (req: Request, res: Response, next) => {
    if (req.user) {
        if ('id' in req.user && 'username' in req.user) {
            const accountDetails = {
                id: req.user.id,
                username: req.user.username
            };
            res.send(accountDetails);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/register', async (req: Request, res: Response, next) => {

    if (!req.body.username || req.body.username === '') {
        return next(new HttpError(400, 'Propriété username manquante'));
    }
    if (!req.body.password || req.body.password === '') {
        return next(new HttpError(400, 'Propriété password manquante'));
    }

    const saltBuffer = crypto.randomBytes(16);
    const salt = saltBuffer.toString('base64');

    crypto.pbkdf2(req.body.password, salt, 10000, 64, 'sha512', async (err, derivedKey) => {
        if (err) {
            return next(err);
        }

        const hash = derivedKey.toString('base64');

        try {
            const account = await prisma.account.create({
                data: {
                    username: req.body.username,
                    password_hash: hash,
                    password_salt: salt
                }
            });

            res.send(account);
        } catch (err) {
            next(err);
        }
    });
});


export default router;