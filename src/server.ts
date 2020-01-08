import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes';
import config from '../config';
import sockets from './sockets';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

mongoose.connect('mongodb://localhost:27017/bingo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

import http from 'http';
const server = http.createServer(app);

server.listen(config.port, () => {
  sockets.init(server, '/bingo', () => {
    console.log(`Listening port ${config.port}`);
  });
});
