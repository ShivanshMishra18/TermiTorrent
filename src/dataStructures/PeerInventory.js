const bignum = require('bignum');
const { getBlocksPerPiece, getBlockLength, BLOCK_LENGTH } = require("../torrentUtils/blockRequirements");

/*
    peerInventory: Queue of block info
        : push
        : pop
        : front
        : isEmpty
    For each peer connected, peerInventory stores
    whatever blocks/pieces are available with it
*/
module.exports = class {

    constructor(torrent) {
        this.privTorrent = torrent;
        this.available = [];
        this.chocked = true;
    }

    // Will be called to add pieces to this DS whenever
    // Have or Bitfield messages are received
    push(pieceIndex) {
        const numOfBlocks = getBlocksPerPiece(this.privTorrent, pieceIndex);
        if (pieceIndex >= 725) {
            console.log('*************************************', pieceIndex);
            return;
        }

        for (let i=0; i<numOfBlocks; i++) {
            const block = {
                index: pieceIndex,
                begin: i*BLOCK_LENGTH,
                length: getBlockLength(this.privTorrent, pieceIndex, i)
            };
            this.available.push(block);
        }
    }

    pop() {
        return this.available.shift();
    }

    front() {
        return this.available[0];
    }

    isEmpty() {
        return this.available.length == 0;
    }

    pieceSize() {
        return this.privTorrent.info['piece length'];
    }

};