const net = require('net') ;
const { handshakeMessage } = require('./tcpUtils/tcpMessages');


module.exports = (peer, torrent) => {

    // Create tcp socket
    const socket = new net.Socket();

    // Handle connection error
    socket.on('error', console.log);

    // Send a handshake message to the peer
    socket.connect(peer.port, peer.ip, () => {
        socket.write(handshakeMessage(torrent));
    });

    // Read response from handshake ( for now )
    socket.on('data', recvBuf => {
        console.log(recvBuf, recvBuf.length);
        return;
    });

}