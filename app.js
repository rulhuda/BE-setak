import express from "express";
import createError from 'http-errors';
import cors from "cors";
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import routes from "./src/routes/index.js";
import "dotenv/config";

const app = express();


app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api', routes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
