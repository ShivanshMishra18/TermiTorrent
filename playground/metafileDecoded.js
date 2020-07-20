/*
    I don't know where to find a torrent file for a single download file
    and initially we don't want to be troubled with multiple files. So,
    in this file, I am trying to clean a torrent file from Libre Office 
    downloader which is a legal to fulfill our requirements.

    Comments:
    
    1. Don't remove any property from info, however useless since otherwise
        the hash value will change and no client will work. 
*/
const bencode = require('bencode');
const fs = require('fs');

// const torrent = fs.readFileSync('Capture_201803_archive.torrent');
const torrent = fs.readFileSync('LibreOffice_6.4.5_Linux_x86-64_deb.tar.gz.torrent');

// ------ JSON object in the form of buffers, still unreadable 
// console.log(bencode.decode(torrent));

// ------ Removing optional attributes for simplicity
const raw = bencode.decode(torrent)
delete raw['comment']
delete raw['announce-list']
delete raw['creation date']
delete raw['created by']
// delete raw.info['md5sum'] // Don't delete from info file
// delete raw.info['sha1']
// delete raw.info['sha256']
delete raw['url-list']
delete raw['sources']

// ------ For multi file torrents
// raw.info.name = raw.info.files[0].path[0]
// raw.info.length = raw.info.files[0]['length']
// raw.info.name = Buffer.from(raw.info.name + "/" + raw.info.files[0].path[0])
// delete raw['info']['files']

console.log(raw);
// console.log(Object.keys(raw));

// ------ These contain backup options for direct downloads
// console.log(raw.sources[1].toString());
// console.log(raw['url-list'][1].toString());

fs.writeFileSync('cleaned.torrent', bencode.encode(raw));
