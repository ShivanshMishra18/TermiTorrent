const parser = require('url').parse;
const crypto = require('crypto');

module.exports = (socket, url) => {

    // Parse url
    const parsedURL = parser(url);

    // Message buffer as per specfications - bep_0015
    const buf = Buffer.alloc(16); 
    buf.writeUInt32BE(0x417, 0);            // protocol id
    buf.writeUInt32BE(0x27101980, 4);
    buf.writeUInt32BE(0, 8);                // action
    crypto.randomBytes(4).copy(buf, 12);    // transaction id

    socket.send(buf, 0, buf.length, parsedURL.port, parsedURL.hostname, ()=>{});

    return;
}