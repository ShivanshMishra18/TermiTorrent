const bencode = require('bencode');
const fs = require('fs');
const crypto = require('crypto');
const bignum = require('bignum');


// Right now this justs returns the cleaned torrent we are working with.
// Later we will add the provision for the file path
module.exports.decodeTorrent = () => {
    const file = 'cleaned.torrent';
    const torrent = fs.readFileSync(file);
    return bencode.decode(torrent);
}


// @args - [ torrent(decoded) ]
// @ret  - [ buffer sha1 of info ]
// Returns info hash for decoded torrent file
module.exports.getInfoHash = torrent => {
    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
}


// @args - [ torrent(decoded) ]
// @ret  - [ size for download ]
// Returns total download size [ right now only for single torrent ]
module.exports.getDownloadSize = torrent => {
    // console.log(torrent.info['length']);
    return bignum.toBuffer(torrent.info['length'], { size: 8 });
}


// @args - [ torrent(decoded) ]
// @ret  - [ file name for download ]
// Returns file name where data will be written
module.exports.getFilename = torrent => {
    return torrent.info.name;
}