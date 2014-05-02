function _isFunction (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

function FBApi () {
    this.paging = {};
    this.performingRequest = false;
}

FBApi.prototype.getUserInfo = function(cb) {
    FB.api('/me', function (response) {
        cb.call(null, response);
    });
};

FBApi.prototype.getStream = function(which, cb) {
    if (!which) throw new Error("getStream requires some args");

    var that = this;
    var path = '/me/home?limit=5';

    if (!_isFunction(which)) {
        path += '&' + this.paging[which];
    } else {
        cb = which;
    }

    this.performingRequest = true;

    FB.api(path, function (response) {
        if (response && !response.error) {
            var paging = response.paging;

            if (paging) {
                that.paging = {
                    next: paging.next.match(/until=[0-9]+/)[0],
                    previous: paging.previous.match(/since=[0-9]+/)[0],
                };
            }
        }

        cb.call(null, response);
        this.performingRequest = false;
    });
};
