const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  res.send({ users: ['o', 'b'] });
});

app.use('/', (req, res, next) => {
  res.send({ normal: 'dsfds' });
});

app.listen(3100);
