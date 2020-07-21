const parser = require('url').parse;
const crypto = require('crypto');

module.exports = (socket, url) => {

    
    // Message buffer as per specfications - bep_0015
    const buf = Buffer.alloc(16); 
    
    // protocol id
    buf.writeUInt32BE(0x417, 0);
    // magic number
    buf.writeUInt32BE(0x27101980, 4);
    // action
    buf.writeUInt32BE(0, 8);
    // transaction id
    crypto.randomBytes(4).copy(buf, 12);
    
    // Parse url
    const parsedURL = parser(url);

    socket.send(buf, 0, buf.length, parsedURL.port, parsedURL.hostname, ()=>{});

    return;
}