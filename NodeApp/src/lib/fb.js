var url

var ERRORS = {
  no_at: "FBApi must receive a valid accessToken"
};

function FBApi (accessToken) {
  if (!accesToken) throw new Error()

  this.accessToken = accessToken;
}

FBApi.prototype.BASE_PATH = 'https://graph.facebook.com/';

FBApi.prototype._buildPath = function(path, args) {
  switch(path) {
    case 'me.home':

    return this.BASE_PATH + 'me/home'
  }
};

module.exports = FBApi;
