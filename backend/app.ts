import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';

import accountRouter from './routes/account';


dotenv.config();
const port = process.env.PORT;


const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(passport.initialize());


app.use('/account', accountRouter);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});