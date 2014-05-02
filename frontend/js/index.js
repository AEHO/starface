var FB_OK = false;

$(function () {

  var $loginBtn = $('#login-btn');

  $.ajaxSetup({ cache: true});
  $.getScript('//connect.facebook.net/en_UK/all.js', function(){
    FB.init({
      appId: '307657009382643',
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
      console.log(response);

      console.log(response.authResponse);

      if (response.status === 'connected') {
        var uid = response.authResponse.useID;
        var accessToken = response.authResponse.accessToken;
        $loginBtn.hide();

        console.log(accessToken);

        localStorage.setItem('_fbat', accessToken);

        FB_OK = true;

        // var fba = new FBApi();
        // fba.getStream().then(function (response) {
        //   console.log(response);
        // });

      } else if (response.status === 'not_authorized') {

        // not authorized :(

      } else {

        // an error ocurred

      }
    });

  });

  $loginBtn.click(function () {
    FB.login(function () {}, {scope: "read_stream", return_scopes: true});
  });

});
