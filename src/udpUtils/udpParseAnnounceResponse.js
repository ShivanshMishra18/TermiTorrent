module.exports = response => {
    return new Promise( (resolve, reject) => {

        // Return object
        const obj = {
            action: response.readUInt32BE(0),
            transactionId: response.readUInt32BE(4),
            leechers: response.readUInt32BE(8),
            seeders: response.readUInt32BE(12),
            peers: []
        };
        
        // First 20 bytes have been used above
        response = response.slice(20);
        
        // Temporary buffer store
        let buf;
        
        while (response.length) 
        {
            buf = response.slice(0, 6);
            response = response.slice(6);
            obj.peers.push({
                ip: buf.slice(0,4).join('.'),
                port: buf.readUInt16BE(4)
            });
        }
        
        // console.log(obj);
        
        return resolve(obj.peers);
    });

}