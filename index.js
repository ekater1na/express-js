const express = require('express');
const bodyParser = require('body-parser');
const inject = require('require-all');
const mongoose = require('mongoose');

const app = express();
const router = express.Router;
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded()({ extended: true }));

try {
  const controllers = inject(`${__dirname}/controllers`);
  const actions = inject(`${__dirname}/action`);
  const models = inject(`${__dirname}/models`);

  mongoose.connect('mongodb://localhost:32768/blog', { useNewUrlParser: true });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.info('Database connected');
  });

  // eslint-disable-next-line guard-for-in
  for (const name in controllers) {
    app.use(`/${name}`, controllers[name]({ router, actions, models }));
  }
} catch (e) {
  console.error(e);
}

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
