#### 正则表达式 匹配所有 Number 直接量
/^(\d)|([01])|(0o[0-7]+)|(0x[0-9A-F]+)$/
#### UTF-8 Encoding 的函数
function encodeUTF8(str) {
    let r = '';
    for (s of str) {
        r += '\\u' + (s.codePointAt().toString(16));
    }
    return r;
}
#### 正则表达式，匹配所有的字符串直接量，单引号和双引号
/^([\u0000-\uFFFF])| $/