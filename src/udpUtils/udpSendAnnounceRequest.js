const crypto = require('crypto');
const parser = require('url').parse;
const { getInfoHash, getDownloadSize } = require('../torrentUtils/torrentUtils');
const udpGetPeerId = require('./udpGetPeerId');

const PORT = 6886   // Any port from 6881 to 6889 is valid

module.exports = (socket, url, connectionId, torrent) => {
    
    // Announce buffer as per specfications - bep_0015
    const buf = Buffer.allocUnsafe(98);

    // connection id
    connectionId.copy(buf, 0);
    // action
    buf.writeUInt32BE(1, 8);
    // transaction id
    crypto.randomBytes(4).copy(buf, 12);
    // info hash
    getInfoHash(torrent).copy(buf, 16);
    // peerId
    udpGetPeerId().copy(buf, 36);
    // downloaded
    Buffer.alloc(8).copy(buf, 56);
    // left
    getDownloadSize(torrent).copy(buf, 64);
    // uploaded
    Buffer.alloc(8).copy(buf, 72);
    // event
    buf.writeUInt32BE(0, 80);
    // ip address
    buf.writeUInt32BE(0, 80);
    // key
    crypto.randomBytes(4).copy(buf, 88);
    // num want
    buf.writeInt32BE(-1, 92);
    // port
    buf.writeUInt16BE(PORT, 96);

    // Parse url
    const parsedURL = parser(url);

    socket.send(buf, 0, buf.length, parsedURL.port, parsedURL.hostname, ()=>{});

    return;
}