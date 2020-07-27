const bignum = require('bignum');

module.exports.BLOCK_LENGTH = Math.pow(2, 14);


// @args - [ torrent(decoded), piece index ]
// @ret  - [ length of the piece for a given piece index ]
module.exports.getPieceLength = (torrent, pieceIndex) => {
    const totalLength = bignum.fromBuffer(this.size(torrent)).toNumber();
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
module.exports.getBlockLength = async (torrent, pieceIndex, blockIndex) => {
    const pieceLength = await this.getPieceLength(torrent, pieceIndex);

    const lastBlockLength = pieceLength % this.BLOCK_LENGTH;
    const lastBlockIndex = Math.floor(pieceLength / this.BLOCK_LENGTH);

    if(lastBlockIndex === blockIndex)
        return lastBlockLength;

    return this.BLOCK_LENGTH;  
};