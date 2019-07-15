var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res) => {
  var files = ['/', './index.html', '/app.js', './app.js', '/app.css', './app.css', '/payload', 'data.json'];
  files.forEach((path, index) => {
      if (index % 2 == 0 && req.url == path ) {
        fs.readFile(files[index  + 1]  , 'utf8', (error, page) => {
          // res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(page);
          res.end();
        })
      }

  })
});
server.listen(8888, ()=>{
  console.log('Server listening at port 8888');
});
