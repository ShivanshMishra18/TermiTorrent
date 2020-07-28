const fs = require('fs');

const fd = fs.openSync('./temp.txt', 'w');
fs.write(fd, Buffer.from('Hello_1'), 0, 7, 10, ()=>{});
fs.write(fd, Buffer.from('Hello_2'), 0, 7, 20, ()=>{});
fs.close(fd, ()=>{});