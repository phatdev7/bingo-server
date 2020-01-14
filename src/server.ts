import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoose, { mongo } from 'mongoose';
import { MongoClient } from 'mongodb';
import routes from './routes';
import config from '../config';
import sockets from './sockets';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

mongoose.connect(
  'mongodb://localhost:27001,localhost:27002,localhost:27003/bingo?replicaSet=rs?retryWrites=false',
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
);

import http from 'http';
const server = http.createServer(app);

server.listen(config.port, () => {
  sockets.init(server, '/bingo', () => {
    console.log(`Listening port ${config.port}`);
  });
});
