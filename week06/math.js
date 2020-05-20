//abababx
function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c)
    }
    if (state === end) {
        return true;
    }
    return false;
}

function start(c) {
    if (c === 'a') {
        return findB1
    }else{
        return start;
    }
}

function findB1(c) {
    if(c === 'b') {
        return findA2;
    }else{
        return start(c);
    }
}

function findA2(c) {
    if(c === 'a') {
        return findB2;
    }else{
        return start(c);
    }
}

function findB2(c) {
    if(c === 'b') {
        return findA3;
    }else{
        return start(c);
    }
}

function findA3(c) {
    if(c === 'a') {
        return findB3;
    }else{
        return start(c);
    }
}

function findB3(c) {
    if(c === 'b') {
        return findX;
    }else{
        return start(c);
    }
}

function findX(c) {
    if(c === 'x') {
        return end;
    }else{
        return findA3(c);
    }
}


function end(c) {
    return end;
}

let r = match("ababcababababx")
console.log(r);