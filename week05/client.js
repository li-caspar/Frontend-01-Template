const net = require("net");

class reuqest {
  constructor(options) {
    this.method  = options.method || "GET";
    this.host    = options.host || "127.0.0.1";
    this.port    = options.port || 80;
    this.path    = options.path || '/'
    this.headers = options.headers || {}
    this.body    = options.body || {}
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body)
    }else{      
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  toString() {
    return `
${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r
\r
${this.bodyText}`;
  }
  send(connection) {
    if (connection) {
      connection.write(this.toString());
    } else {
      connection = net.createConnection({host: this.host, port: this.port}, () => {
        connection.write(this.toString());
      });  
    }
  }
}

class response {

}

let request = new reuqest({
  method: "POST",
  host: "127.0.0.1",
  port: 8088,
  path: '/',
  body: {
    name: "caspar"
  },
  headers: {
    ["X-Foo"]: 'bar',
    "b-f": 's'
  }
});
request.send();


//const client = net.createConnection({host: '127.0.0.1', port: 8088}, () => {
  //console.log('connected to server!');
  /*
  client.write('GET / HTTP/1.1\r\n');
  client.write('HOST: 127.0.0.1\r\n'); // HOST要大写  headers部分的冒号后面接着的空格可有可无,建议有
  client.write('Content-Type: application/x-www-form-urlencoded\r\n');
  client.write('Content-Length: 11\r\n');
  client.write('\r\n');
  client.write('name=caspar');
  */
  //字符串模板的首行不能有空格
  /*client.write(`
POST / HTTP/1.1\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: 11\r
\r
name=caspar`);*/
  
  
//});


/*
client.on('data', (data) =>{
  console.log(data.toString());
  client.end();
})
client.on('end', () => {
  console.log('disconnected from server');
})
client.on('error', (err) =>{
  console.log(err);
  client.end();
})
*/


/*
const client = net.connect({
  host: "127.0.0.1",
  port: 8088,
  onread: {
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf){
      console.log(buf.toString('utf8', 0, nread));
    }
  }
})
*/

/*
//原生JS的写法
var xhr = new XMLHttpRequest;
//GET
xhr.open("GET", 'http://127.0.0.1:8088', true);
xhr.send(null)
console.log(xhr.responseText)
//POST
xhr.open("POST", 'http://127.0.0.1:8088', true);
xhr.send("foo=bar");
console.log(xhr.responseText)
*/