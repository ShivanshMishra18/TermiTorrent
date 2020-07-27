module.exports.bitfieldHandler = (buf, peerInventory) => {
    
    let counter = 0;

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
                counter++;
            }
        }
    }

    // console.log(counter, 'pieces available with client');
}