const fs = require('fs');
const { decodeTorrent, getFilename } = require('./torrentUtils/torrentUtils')
const getPeersList = require('./getPeersList');
const downloadFromPeer = require('./downloadFromPeer');
const GlobalInventory = require('./dataStructures/GlobalInventory');


async function run() {   

    // Step 1 - Decode torrent file
    const torrent = decodeTorrent();

    // Step 2 - Complete all UDP transactions and get peer ip/ports
    const peersList = await getPeersList(torrent);
    // console.log(peersList);

    // Step 3 - Create global DS, open output file
    const globalInventory = new GlobalInventory(torrent);
    const fd = fs.openSync(getFilename(torrent), 'w');

    // Step 4 - Connect to peers and request data
    // { ip: '211.15.14.88', port: 59350 } sends have message [ for test help ]
    console.log(peersList[8]);
    downloadFromPeer(peersList[8], torrent, fd, globalInventory);

}

run();