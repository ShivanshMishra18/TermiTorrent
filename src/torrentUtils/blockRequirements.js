const bencode = require('bencode');
const fs = require('fs');
const crypto = require('crypto');
const bignum = require('bignum');

module.exports.BLOCK_LENGTH = Math.pow(2, 14);

// @args - [ torrent(decoded), piece index ]
// @ret  - [ length of the piece for a given piece index]
module.exports.findPieceLength = (torrent, pieceIndex) => {
  const totalLength = bignum.fromBuffer(this.size(torrent)).toNumber();
  const pieceLength = torrent.info['piece length'];

  const lastPieceLength = totalLength % pieceLength;
  const lastPieceIndex = Math.floor(totalLength / pieceLength);

  if(lastPieceIndex === pieceIndex)
	return lastPieceLength;
  else
	return pieceLength;  

};

// @args - [ torrent(decoded), piece index ]
// @ret  - [ number of blocks for a given piece index ]
module.exports.findBlocksPerPiece = (torrent, pieceIndex) => {
  const pieceLength = this.findPieceLength(torrent, pieceIndex);
	
  return Math.ceil(pieceLength / this.BLOCK_LENGTH);
};