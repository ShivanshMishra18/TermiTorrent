const { decodeTorrent } = require("./torrentUtils")

require('./torrentUtils');
const getPeersList = require('./getPeersList');

async function run() {   
    const torrent = decodeTorrent();
    // console.log(torrent);

    await getPeersList(torrent);
}

run();