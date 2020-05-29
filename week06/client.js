const net = require("net")
const parse = require("./parser")
class Request {
  constructor({
    host,
    port = 80,
    path = '/',
    method = 'GET',
    headers,
    body = {},
  }) {
    this.method = method || 'GET';
    this.host = host || '127.0.0.1';
    this.port = port || '80',
    this.path = path || '/';
    const {
      ['Content-Type']: contentType = 'application/x-www-form-urlencoded',
    } = headers;
    switch (contentType) {
      case 'application/x-www-form-urlencoded': {
        this.bodyText = Object.keys(body).map(key => `${key}=${encodeURIComponent(body[key])}`).join('&')
        break;
      }
      case 'application/json': {
        this.bodyText = JSON.stringify(body)
        break;
      }
      default: this.bodyText = '';
    }
    this.headers = {
      ['Content-Type']: 'application/x-www-form-urlencoded',
      ...headers,
      ['Content-Length']: this.bodyText.length,
    };
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const resPar = new ResponseParse();
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          connection.write(this.toString());
        });
      }
      connection.on('data', (data) => {
        resPar.receive(data.toString())
        // console.log("isFinished", resPar.getIsFinished());
        if(resPar.getIsFinished()) {
          resolve(resPar.getResponse())
        }
        connection.end();
      });
      connection.on('error', (error) => {
        reject(error);
        connection.end();
      });
    })
    
  }
}

class Response {

}

class ResponseParse {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
  
    this.curStatus = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';

    this.bodyPaser = null;
  }
  receive(string){
    for (let i = 0; i < string.length; i ++) {
      this.receiveChar(string.charAt(i))
    }
  }
  getIsFinished() {
    return this.bodyPaser &&  this.bodyPaser.finish;
  }
  getResponse(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return ({
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyPaser.content.join('')
    })
  }
  receiveChar(char) {
    switch (this.curStatus) {
      case this.WAITING_STATUS_LINE: {
        if (char === '\r') {
          this.curStatus = this.WAITING_STATUS_LINE_END;
        } else if (char === '\n') {
          this.curStatus = this.WAITING_HEADER_NAME;
        } else {
          this.statusLine += char;
        }
        break;
      }
      case this.WAITING_STATUS_LINE_END: {
        if (char === '\n') {
          this.curStatus = this.WAITING_HEADER_NAME;
        }
        break;
      }
      case this.WAITING_HEADER_NAME: {
        if (char === ':') {
          this.curStatus = this.WAITING_HEADER_SPACE;
        } else if (char === '\r') {
          this.curStatus = this.WAITING_HEADER_BLOCK_END;
        } else {
          this.headerName += char;
        }
        break;
      }
      case this.WAITING_HEADER_SPACE: {
        if (char === ' ') {
          this.curStatus = this.WAITING_HEADER_VALUE;
        }
        break;
      }
      case this.WAITING_HEADER_VALUE: {
        if (char === '\r') {
          this.curStatus = this.WAITING_HEADER_LINE_END;
          this.headers[this.headerName] = this.headerValue;
          this.headerName = '';
          this.headerValue = '';
        } else {
          this.headerValue += char;
        }
        break;
      }
      case this.WAITING_HEADER_LINE_END: {
        if (char === '\n') {
          this.curStatus = this.WAITING_HEADER_NAME;
        }
        break;
      }
      case this.WAITING_HEADER_BLOCK_END: {
        if (char === '\n') {
          this.curStatus = this.WAITING_BODY;
          this.bodyPaser = new TrunkedBodyParse(this.headers['Transfer-Encoding'])
        }
        break;
      }
      case this.WAITING_BODY: {
        this.bodyPaser.receiveChar(char)
        //console.log('bodyPaser.content', this.bodyPaser.content)
      }
      default: break;
    }
  }
}

class TrunkedBodyParse {
  constructor(type) {
    this.type = type;
    switch (type) {
      case 'chunked': {
        this.WAINTING_LENGTH = 0;
        this.WAINTING_LENGTH_LINE_END = 1;
        this.READING_CHUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.curStatus = this.WAINTING_LENGTH;
        this.length = 0;
        this.finish = false;
        this.content = [];
      }
      default: break;
    }
  }

  receiveChar(char){
    //console.log(this.curStatus, JSON.stringify(char))
    switch (this.type) {
      case 'chunked': {
        switch (this.curStatus) {
          case this.WAINTING_LENGTH: {
            if (char === '\r') {
              if (this.length === 0) {
                this.finish = true;
                break;
              }
              this.curStatus = this.WAINTING_LENGTH_LINE_END;
            } else {
              //this.length *= 10;
              //this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
              this.length *= 16;
              this.length += parseInt(char, 16);
              //console.log('length', char, this.length)
            }
            break;
          }
          case this.WAINTING_LENGTH_LINE_END: {
            if (char === '\n') {
              this.curStatus = this.READING_CHUNK;
            }
            break;
          }
          case this.READING_CHUNK: {
            this.content.push(char);
            this.length --;
            if (this.length === 0) {
              this.curStatus = this.WAITING_NEW_LINE;
            }
            break;
          }
          case this.WAITING_NEW_LINE: {
            if (char === '\r') {
              this.curStatus = this.WAITING_NEW_LINE_END;
            }
            break;
          }
          case this.WAITING_NEW_LINE_END: {
            if (char === '\n') {
              this.curStatus = this.WAINTING_LENGTH;
            }
            break;
          }
          default: break;
        }
        break;
      }
      default: break
    }
  }
}

void async function() {
  let req = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8080,
    headers: {
      ['test']: 'test',
    },
    body: {
      name: 'caspar',
    },
  })
  //console.log(req.toString())
  const res = await req.send();
  parse.parseHTML(res.body)
  //console.log(res.body);
} ()


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