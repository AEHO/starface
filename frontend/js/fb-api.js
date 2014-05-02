function FBApi () {
    this.paging = {};
}

FBApi.prototype.getUserInfo = function(cb) {
    var def = $.Deferred();

    FB.api('/me', function (response) {
        if (!response || response.error) {
            def.reject(response);
        } else {
            def.resolve(response);
        }
    });

    return def.promise();
};

FBApi.prototype.getStream = function(which) {
    var def = $.Deferred();

    var that = this;
    var path = '/me/home?limit=5';

    if (which) {
        path += '&' + this.paging[which];
    }

    FB.api(path, function (response) {
        if (response && !response.error) {
            var paging = response.paging;

            if (paging) {
                that.paging = {
                    next: paging.next.match(/until=[0-9]+/)[0],
                    previous: paging.previous.match(/since=[0-9]+/)[0],
                };
            }

            def.resolve(response);
        } else {
            def.reject(response);
        }
    });

    return def.promise();
};
