const net = require('net') ;
const { handshakeMessage, verifyHandshake, interestedMessage } = require('./tcpUtils/tcpMessages');
const { CHOKE, UNCHOKE, INTERESTED, NOT_INTERESTED, BITFIELD, HAVE, REQUEST, PIECE, CANCEL } = require('./tcpUtils/messageTypes');
const PeerInventory = require('./dataStructures/PeerInventory');
const { bitfieldHandler, haveHandler, unchokeHandler, chokeHandler, pieceHandler } = require('./tcpUtils/tcpHandlers');


module.exports = (peer, torrent, fd, globalInventory) => {

    // console.log(globalInventory);
    // console.log(peer);

    // Create local peer inventory object
    const peerInventory = new PeerInventory(torrent);

    // Create variables which will be used inside closure
    let allMsgBuf = Buffer.alloc(0);
    let handshaked = false;

    // Create tcp socket
    const socket = new net.Socket();

    // Handle connection error
    socket.on('error', console.log);

    // Send a handshake message to the peer
    socket.connect(peer.port, peer.ip, () => {
        socket.write(handshakeMessage(torrent));
        console.log('Handshake initiated');
    });

    // Here we act upon the type of msg
    socket.on('data', recvBuf => {

        // console.log('Message received through TCP');
        
        // Find message length for non handshakes
        const getMsgLength = () => allMsgBuf.readInt32BE(0) + 4;

        // Join incoming buffer to full buffer 
        allMsgBuf = Buffer.concat([allMsgBuf, recvBuf]);

        if (!handshaked) 
        {
            // Extract single message
            const msgLen = allMsgBuf.readUInt8(0) + 49;
            const msg = allMsgBuf.slice(0, msgLen);
            allMsgBuf = allMsgBuf.slice(msgLen);

            // Verify handshake
            if (verifyHandshake(msg)) {
                console.log('[+] Handshake completed');
                handshaked = true;
                socket.write(interestedMessage());
            } else {
                console.log('[-] Unexpected failure. Abort manually.');
            } 
        } 
        else 
        {
            // Extract single message as long as it is valid and work
            while (allMsgBuf.length>=4 && allMsgBuf.length>=getMsgLength()) 
            {
                // Consider single message
                const msgLen = getMsgLength();
                const msg = allMsgBuf.slice(0, msgLen);
                allMsgBuf = allMsgBuf.slice(msgLen);

                // Leave aside keep-alive connection
                if (msg.length === 4)
                    continue;

                // Handle message according to type
                switch (msg.readUInt8(4)) {
                    case CHOKE: {
                        console.log('chokeHandler');
                        chokeHandler(socket, peerInventory);
                        break;
                    }
                    case UNCHOKE: {
                        console.log('unchokeHandler');
                        unchokeHandler(socket, peerInventory, globalInventory);
                        break;
                    }
                    case INTERESTED: {
                        console.log('interestedHandler');
                        break;
                    }
                    case NOT_INTERESTED: {
                        console.log('notinterestedHandler');
                        break;
                    }
                    case HAVE: {
                        console.log('haveHandler');
                        haveHandler(msg, peerInventory);
                        break;
                    }
                    case BITFIELD: {
                        console.log('bitfieldHandler');
                        // console.log(msg);
                        bitfieldHandler(msg, peerInventory);
                        // console.log(peerInventory.available.length);
                        break;
                    }
                    case REQUEST: {
                        console.log('requestHandler');
                        break;
                    }
                    case PIECE: {
                        console.log('pieceHandler');
                        pieceHandler(socket, msg, fd, peerInventory, globalInventory);
                        // console.log('Block received!', msg);
                        break;
                    }
                    case CANCEL: {
                        console.log('cancelHandler');
                        break;
                    }
                    case PORT: {
                        console.log('portHandler');
                        break;
                    }
                    default: {
                        console.log('[*] Unknown message received');
                        console.log(msg);
                    }
                }
            }
        }

    });

}

/*
    Note - As every incoming message except handshake and keep-alive
        has a type from bytes 1-4, we can identify them by decoding
        those bytes. However, keep-alive is identified by its pstrlen
        which is =0, and we know that handshake is always the firts
        message to arrive. By exploiting closures, we create a variable
        which tells whether handshake has taken or not.
*/