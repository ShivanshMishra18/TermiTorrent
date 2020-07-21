
const dgram = require('dgram');
const udpSendConnectRequest = require('./udpUtils/udpSendConnectRequest')

const CONNECT = 0;
const ANNOUNCE = 1;

module.exports = torrent => {
    return new Promise((resolve, reject) => {

        // Create socket for connection
        const socket = dgram.createSocket('udp4');
        // Get target url
        const targetURL = torrent.announce.toString();
        
        // Send connect message
        udpSendConnectRequest(socket, targetURL);

        socket.on('message', response => {
            switch (response.readUInt32BE(0)) {

                // Response for connect request
                case CONNECT: {
                    console.log('[+] Connect response received');
                    console.log(response);
                    return resolve();
                }
                
                // Response for announce request
                case ANNOUNCE: {
                    console.log('[+] Announce response received');
                }

                default : {
                    console.log('[*] Unkown UDP response received');
                    return reject();
                }
            }
        });

    });
}