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


module.exports.requestBlockMessage = (index, offset, size) => {
    const buf = Buffer.alloc(17);
    
    // pstrlen
    buf.writeUInt32BE(13, 0);
    // pstr
    buf.writeUInt8(6, 4);
    // index
    buf.writeUInt32BE(index, 5);
    // begin
    buf.writeUInt32BE(offset, 9);
    // length
    buf.writeUInt32BE(size, 13);

    // console.log(buf);
    
    return buf;
};


module.exports.interestedMessage = () => {
    const buf = Buffer.alloc(5);
 	
	// length
  	buf.writeUInt32BE(1, 0);
  	// id
  	buf.writeUInt8(3, 4);
  	
	return buf;
};