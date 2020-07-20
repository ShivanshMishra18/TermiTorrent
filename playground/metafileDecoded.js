/*
    I don't know where to find a torrent file for a single download file
    and initially we don't want to be troubled with multiple files. So,
    in this file, I am trying to clean a torrent file from archive.org 
    which is a legal torrent site to fulfill our requirements.
*/
const bencode = require('bencode');
const fs = require('fs');

const torrent = fs.readFileSync('Capture_201803_archive.torrent');

// JSON object in the form of buffers, still unreadable 
// console.log(bencode.decode(torrent));

// console.log(bencode.decode(torrent).info.collections[0].toString('utf8'));

// Removing optional attributes for simplicity
const raw = bencode.decode(torrent)
delete raw['comment']
delete raw['announce-list']
delete raw['creation date']
delete raw['created by']
delete raw.info['collections']
delete raw['url-list']
delete raw['locale']
delete raw['title']

console.log(raw.info.files[0]);
// console.log(raw['title'].toString());
// fs.writeFileSync('cleaned.torrent', bencode.encode(raw));

// File paths
// bencode.decode(torrent).info.files.forEach(file => {console.log(file.path[0].toString('utf8'))})

// console.log(bencode.decode(torrent).parse().toString('utf8'));