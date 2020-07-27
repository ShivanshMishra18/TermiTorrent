const { decodeTorrent } = require('./torrentUtils/torrentUtils')
const getPeersList = require('./getPeersList');
const downloadFromPeer = require('./downloadFromPeer');


async function run() {   

    // Step 1 - Decode torrent file
    const torrent = decodeTorrent();

    // Step 2 - Complete all UDP transactions and get peer ip/ports
    const peersList = await getPeersList(torrent);
    console.log(peersList);

    // Step 3 - Connect to peers and request data
    downloadFromPeer(peersList[3], torrent);

}

run();