//字符串转成数字
function convertStringToNumber(str, hex) {
    if(arguments.length < 2){
        hex = 10;
    }
    var chars = str.split('');//将字符串分隔成字符数组
    var number = 0;
    var i = 0;
    while(i < chars.length && chars[i] != '.') {
        number *= hex;
        number += chars[i].codePointAt(0) - '0'.codePointAt(0);//取码点数 减去 字符0的码点数
        i++
    }
    if(chars[i] == '.') {
        i++
    }
    var fraction = 1;
    while(i < chars.length) {
        fraction /= hex;
        number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction
        i++
    }
    return number;
}


//数字转成字符串
function convertNumberToString(number, hex) {
    if(arguments.length < 2) {
       hex = 10;
    }
    var integer = Math.floor(number);//取整数部分
    var fraction = number - integer
    var string = '';
    while(integer > 0) {
       string = String(integer % x) + string;
       integer = Math.floor(integer / x);
    }
    if(fraction) {
        string +='.'
        while(fraction) {
            fraction *= hex
            string += Math.floor(fraction)
            fraction -= Math.floor(fraction)
        }
    }
    return string;
}