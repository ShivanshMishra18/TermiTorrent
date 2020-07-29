const bignum = require('bignum');
const { getDownloadSize } = require('./torrentUtils');

module.exports.BLOCK_LENGTH = Math.pow(2, 14);


// @args - [ torrent(decoded), piece index ]
// @ret  - [ length of the piece for a given piece index ]
module.exports.getPieceLength = (torrent, pieceIndex) => {
    const totalLength = bignum.fromBuffer(getDownloadSize(torrent)).toNumber();
    const pieceLength = torrent.info['piece length'];

    const lastPieceLength = totalLength % pieceLength;
    const lastPieceIndex = Math.floor(totalLength / pieceLength);

    if(lastPieceIndex === pieceIndex)
        return lastPieceLength;

    return pieceLength;  
};


// @args - [ torrent(decoded), piece index ]
// @ret  - [ number of blocks for a given piece index ]
module.exports.getBlocksPerPiece = (torrent, pieceIndex) => {
    const pieceLength = this.getPieceLength(torrent, pieceIndex);
    return Math.ceil(pieceLength / this.BLOCK_LENGTH);
};


// @args - [ torrent(decoded), piece index, block index ]
// @ret  - [ length of the block for a given block index with given piece index ]
module.exports.getBlockLength = (torrent, pieceIndex, blockIndex) => {
    const pieceLength = this.getPieceLength(torrent, pieceIndex);

    const lastBlockLength = pieceLength % this.BLOCK_LENGTH;
    const lastBlockIndex = Math.floor(pieceLength / this.BLOCK_LENGTH);

    if(lastBlockIndex === blockIndex)
        return lastBlockLength;

    return this.BLOCK_LENGTH;  
};


// @args - [ torrent(decoded) ]
// @ret  - [ total number of pieces ]
module.exports.getNumOfPieces = torrent => {
    return torrent.info.pieces.length / 20;
}