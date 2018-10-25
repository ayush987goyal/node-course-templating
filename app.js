const express = require('express');

const app = express();

app.use('/add-product', (req, res, next) => {
  console.log('In another middle');
  res.send({ yoadd: 'fsdfsfsdfsf' });
});

app.use('/', (req, res, next) => {
  console.log('In another middle');
  res.send({ yo: 'fsdfsf' });
});

app.listen('3000');
