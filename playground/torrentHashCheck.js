/* 
    This file is only to verify if the info hash (sha1) in the metafile
    provided is the same or not. Although, for general case, one must 
    not rely on that, but create hash himself.

    We will use this code later for creating info hashes whenever required.

    Result: Turns out that the sha1 value in info is something else
*/

const crypto = require('crypto')
const bencode = require('bencode');
const fs = require('fs');

const file = 'cleaned.torrent';
const torrent = fs.readFileSync(file);
const raw = bencode.decode(torrent);
const info = bencode.encode(raw.info);

const hash = crypto.createHash('sha1').update(info).digest();

console.log(hash);
console.log(raw.info.sha1);