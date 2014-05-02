var getLocalIp = function () {
    var ifaces = require('os').networkInterfaces();
    var wlan0 = ifaces['wlan0'];

    if (!wlan0) {
        return;
    }

    return wlan0.length > 1 ? wlan0[0].address : '';
};

exports.getLocalIp = getLocalIp;
