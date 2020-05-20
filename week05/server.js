const http = require('http');

const server = http.createServer((req, res) => {
  //打印request的headers
  console.log(req.headers);

  var postData = "";//post提交上来的数据
  req.on("data", function(chunk){
    postData += chunk;
  });
  req.on("end", function(){
    console.log('postData', postData);
  })

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('ok');
});
server.listen(8088);
