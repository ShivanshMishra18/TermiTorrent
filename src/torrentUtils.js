const bencode = require('bencode');
const fs = require('fs');
const crypto = require('crypto');

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
    const info = bencode.decode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
}