const fs = require('fs');
const { interestedMessage, requestBlockMessage } = require("./tcpMessages");


module.exports.bitfieldHandler = (buf, peerInventory) => {
    // let counter = 0;

    // Drop conneection if wrong size (as per protocol)
    if (buf.readUInt32BE(0)+4 != buf.length) {
        console.log('Abort Manually');
        return;
    }

    for (let i=5; i<buf.length; i++) {
        let x = buf.readUInt8(i);
        for (let j=0; j<8; j++) {
            if ((x&(1<<j))===1) {
                peerInventory.push(i*8 + 7 - j);
                // counter++;
            }
        }
    }

    // console.log(counter, 'pieces available with client');
}


module.exports.haveHandler = (buf, peerInventory) => {
    
    // Read piece index form message
    const pieceIndex = buf.readUInt32BE(5);

    // Push piece index
    peerInventory.push(pieceIndex);

}


module.exports.chokeHandler = (socket, peerInventory) => {
    peerInventory.chocked = true;
    socket.write(interestedMessage());
}


module.exports.unchokeHandler = (socket, peerInventory, globalInventory) => {
    peerInventory.chocked = false;
    this.requestNextBlock(socket, peerInventory, globalInventory);
}


module.exports.pieceHandler = (socket, buf, fd, peerInventory, globalInventory) => {
    
    // Extract information from piece message
    const { pieceIndex, blockOffset, data } = this.unboxBlockMessage(buf);

    // Write piece to file using file descriptor passed
    const totalOffset = pieceIndex*peerInventory.pieceSize() + blockOffset;
    fs.write(fd, data, 0, data.length, totalOffset, ()=>{});

    // Update global inventory
    globalInventory.blockReceived(pieceIndex, blockOffset);
    globalInventory.updateDownloaded(data.length);

    // Request for next block (if remaining otherwise close connection)
    if (globalInventory.allReceived()) {
        console.log('[+] Download complete');
        socket.end();
    }

    this.requestNextBlock(socket, peerInventory, globalInventory);
}


module.exports.requestNextBlock = (socket, peerInventory, globalInventory) => {

    // console.log(peerInventory);

    // If peer has choked us then return 
    if (peerInventory.chocked) {
        return;
    }

    // If peer has something to offer, request for a block 
    // which has not been requested from any other peer
    while (!peerInventory.isEmpty()) {
        const { index, begin, length } = peerInventory.pop();
        if (globalInventory.isRequired(index, begin)) {
            globalInventory.blockRequested(index, begin);
            socket.write(requestBlockMessage(index, begin, length));
            // console.log('Block requested', index, begin, length);
            break;
        }
    }

}


module.exports.unboxBlockMessage = buf => {
    return {
        pieceIndex: buf.readUInt32BE(5),
        blockOffset: buf.readUInt32BE(9),
        data: buf.slice(13)
    };
}