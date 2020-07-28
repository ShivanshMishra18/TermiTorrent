const { interestedMessage } = require("./tcpMessages");

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
            if (x & (1<<j)) {
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

    console.log('Piece index', pieceIndex, 'found');
    console.log(buf);
}


module.exports.chokeHandler = (socket, peerInventory) => {
    peerInventory.chocked = true;
    socket.write(interestedMessage());
}


module.exports.unchokeHandler = (socket, peerInventory, globalInventory) => {
    peerInventory.chocked = false;
    this.requestNextBlock(socket, peerInventory, globalInventory);
}


module.exports.pieceHandler = (buf, fd, peerInventory, globalInventory) => {
    
    // Extract information from piece message
    
    // Write piece to file using file descriptor passed

    // Update global inventory

    // Request for next block (if remaining otherwise close connection)

}


module.exports.requestNextBlock = (socket, peerInventory, globalInventory) => {

}


module.exports.unboxBlock = buf => {
    return {
        pieceIndex: buf.readUInt32BE(5),
        blockOffset: buf.readUInt32BE(9),
        data: buf.slice(13)
    };
}