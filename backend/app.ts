import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const port = process.env.PORT;

import passport from 'passport';
import { BasicStrategy } from 'passport-http';

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

const app = express();

// User verification function
//TODO: Use database
const verifyFunction = function(username: string, password: string, done: any) {
  if (username === 'user' && password === 'password') {
    return done(null, { username: 'user' });
  } else {
    return done(null, false);
  }
};

passport.use(new BasicStrategyModified({}, verifyFunction));
app.use(passport.initialize());


//passport example
// app.get('/', passport.authenticate('basic', { session: false }), (req: Request, res: Response) => {
//   res.send("app.get('/')");
// });

// default REST answer
app.get('/', (req: Request, res: Response) => {
  res.send("app.get('/')");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});