const { getInfoHash } = require("../torrentUtils/torrentUtils");
const udpGetPeerId = require("../udpUtils/udpGetPeerId");

module.exports.handshakeMessage = torrent => {
    const buf = Buffer.alloc(68);
    
    // pstrlen
    buf.writeUInt8(19, 0);
    // pstr
    Buffer.from('BitTorrent protocol').copy(buf, 1);
    // reserved
    buf.writeUInt32BE(0, 20);
    // reserved
    buf.writeUInt32BE(0, 24);
    // info hash
    getInfoHash(torrent).copy(buf, 28);
    // peer id
    udpGetPeerId().copy(buf, 48);
    
    return buf;
};

module.exports.verifyHandshake = buf => {
    return buf.slice(1,buf.readUInt8(0)+1).toString() === 'BitTorrent protocol';
};