const dgram = require('dgram');
const udpSendConnectRequest = require('./udpUtils/udpSendConnectRequest');
const udpSendAnnounceRequest = require('./udpUtils/udpSendAnnounceRequest');
const udpParseAnnounceResponse = require('./udpUtils/udpParseAnnounceResponse');

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

        socket.on('message', async response => {
            switch (response.readUInt32BE(0)) {

                // Response for connect request
                case CONNECT: {
                    console.log('[+] Connect response received');
                    console.log(response);

                    // Obtain connection id buffer
                    const connectionId = response.slice(8);

                    // Send announce message
                    udpSendAnnounceRequest(socket, targetURL, connectionId, torrent);

                    break;
                }
                
                // Response for announce request
                case ANNOUNCE: {
                    console.log('[+] Announce response received');
                    console.log(response);

                    // Parse response object to get peer list
                    const peerList = await udpParseAnnounceResponse(response);

                    return resolve(peerList);
                }

                default : {
                    console.log('[*] Unkown UDP response received');
                }
            }
        });

    });
}

// TODOS
// 1. Validate transaction ids
// 2. Change default to error handler