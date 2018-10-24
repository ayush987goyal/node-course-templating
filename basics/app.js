const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html></html>');
    res.write('<head>Enter Message</head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    return res.end();
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html><h1>Hello from node</h1></html>');
  res.end();
});

server.listen(3000);
