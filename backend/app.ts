import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send("app.get('/')");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});