const { getNumOfPieces, getBlocksPerPiece, BLOCK_LENGTH } = require("../torrentUtils/blockRequirements");

/*
    This DS is in the form of vector of vectors
    or array of arrays where each array container
    holds information whether that block has been
    requested/received or not.
*/
module.exports = class {

    constructor(torrent) {
        function containerBuilder() {
            const numOfPieces = getNumOfPieces(torrent);
            const outerArray = new Array(numOfPieces).fill(null);
            return outerArray.map((val,idx) => new Array(getBlocksPerPiece(torrent, idx)).fill(false));
        }

        this.__requested = containerBuilder();
        this.__received = containerBuilder();
        this.__downloadSize = torrent.info['length'];
        this.__downloaded = 0;
    }

    blockReceived(pieceIndex, blockOffset) {
        const blockIndex = blockOffset / BLOCK_LENGTH;
        this.__received[pieceIndex][blockIndex] = true;
    }

    blockRequested(pieceIndex, blockOffset) {
        const blockIndex = blockOffset / BLOCK_LENGTH;
        this.__requested[pieceIndex][blockIndex] = true;
    }

    isRequired(pieceIndex, blockOffset) {
        const blockIndex = blockOffset / BLOCK_LENGTH;

        // If every block has been requested we update
        // requested to those blocks which have been received
        if(this.__requested.every(piece => piece.every(block => block))) {
            this.__requested = this.__received.map(piece => piece);
        }

        console.log('pieceIndex:', pieceIndex, ' blockIndex:', blockIndex);
        // console.log('Matrix size:', this.__requested.length, 'x', this.__requested[0].length);

        return !this.__requested[pieceIndex][blockIndex];
    }

    allReceived() {
        return this.__received.every(piece => piece.every(block => block));
    }

    updateDownloaded(size) {
        this.__downloaded = this.__downloaded + size;
        console.log('Completed:', this.__downloaded, 'of', this.__downloadSize);
    }

};