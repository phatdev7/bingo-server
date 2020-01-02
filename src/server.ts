import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

mongoose.connect('mongodb://localhost:27017/bingo', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(6789, () => {
  console.log('Listening port 6789');
});
