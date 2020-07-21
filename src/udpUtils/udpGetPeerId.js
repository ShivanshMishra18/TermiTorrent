const crypto = require('crypto');

let peerId = null;

module.exports = () => {
    if (peerId == null) {
        peerId = crypto.randomBytes(20);
        Buffer.from('-TT1001-').copy(peerId, 0);
    }
    return peerId;
}