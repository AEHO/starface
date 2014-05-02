var exampleJson = {
  "data": [
    {
      "id": "759990137367792_760040484029424",
      "from": {
        "id": "759990137367792",
        "name": "Gleyce Leitte"
      },
      "story": "Gleyce Leitte shared Ronny & Rangel's photo.",
      "picture": "https://fbcdn-photos-c-a.akamaihd.net/hphotos-ak-prn2/t1.0-0/10168216_834635666551494_160376785781008587_s.png",
      "link": "https://www.facebook.com/ronnyerangel/photos/a.372829386065460.102739.111927935488941/834635666551494/?type=1",
      "name": "Timeline Photos",
      "caption": "BORA SER FELIZZZ....\n#boatarde #energia #música #top #tamojunto #deusnocomando\n#ronnyerangel — with Sandra Alves and 4 others.",
      "description": "Todo dia é dia!",
      "properties": [
        {
          "name": "By",
          "text": "Ronny & Rangel",
          "href": "https://www.facebook.com/ronnyerangel?ref=stream"
        }
      ],
      "icon": "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yD/r/aS8ecmYRys0.gif",
      "actions": [
        {
          "name": "Comment",
          "link": "https://www.facebook.com/100000704384095/posts/760040484029424"
        },
        {
          "name": "Like",
          "link": "https://www.facebook.com/100000704384095/posts/760040484029424"
        }
      ],
      "privacy": {
        "value": ""
      },
      "type": "photo",
      "status_type": "shared_story",
      "object_id": "834635666551494",
      "application": {
        "name": "Facebook for Android",
        "namespace": "fbandroid",
        "id": "350685531728"
      },
      "created_time": "2014-05-02T02:09:23+0000",
      "updated_time": "2014-05-02T02:09:23+0000"
    }
  ]
};

$(function () {
  $.ajaxSetup({ cache: true});
  $.getScript('//connect.facebook.net/en_UK/all.js', function(){
    FB.init({
      appId: '307657009382643',
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
      if (response.status === 'connected') {
        var uid = response.authResponse.useID;
        var accessToken = response.authResponse.accessToken;

        console.log(uid);

        FB_OK = true;

        var fba = new FBApi();
        fba.getStream().then(function (response) {
          console.log(response);
        });

      } else if (response.status === 'not_authorized') {
        // not authorized :(
      } else {
        // an error ocurred
      }
    });

  });
});

var Space = (function(){
  var module = {};

  var scene;
  var camera;
  var renderer;
  var maxAnisotropy;
  var canvas;
  var context;
  var timelineJSON;

  var boxes = [];
  var nextRefreshZ = -10;
  var keysPressed = {
    Up: false,
    Down: false,
    Left: false,
    Right: false
  };

  var getTimelineJSON = function(){
    timelineJSON = exampleJson.data;
  };

  var addBox = function(canvas){
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = maxAnisotropy;
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var geometry = new THREE.PlaneGeometry(2,2);
    var box = new THREE.Mesh(geometry, material);
    // box.position.x = camera.position.x + Math.random() * 30 - 15;
    // box.position.y = camera.position.y + Math.random() * 30 - 15;
    // box.position.z = camera.position.z + Math.random() * 50 - 55;
    boxes.push(box);
    scene.add(box);
  };

  var drawPost = function(post, canvas){
    var image_context = canvas.getContext('2d');
    var title_context = canvas.getContext('2d');
    var description_context = canvas.getContext('2d');
    var user_context = canvas.getContext('2d');
    user_context.font = "50px Helvetica";
    user_context.fillStyle = "rgba(255,255,255,1)";
    user_context.fillText(post.from.name, 10, 1010);
    if(post.type === "photo") {
      var img = new Image;
      img.onload = function(){
        image_context.drawImage(img, 0,0);
      }
      //TODO: Solver cross-origin images
      img.src = post.picture;
      
      title_context.font = "40px Helvetica";
      title_context.fillStyle = "rgba(255,255,255,1)";
      title_context.fillText(post.story, 10, 40);

      description_context.font = "40px Helvetica";
      description_context.fillStyle = "rgba(255,255,255,1)";
      description_context.fillText(post.description, 10, 90);
    }
  }

  var loadMore = function(count){
    for(var i=0; i < count; i++){
      addBox(canvas);
    }
  };

  module.init = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true});
    maxAnisotropy = renderer.getMaxAnisotropy();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xffffff, 1 );
    document.body.appendChild(renderer.domElement);
    getTimelineJSON();
    camera.position.z = 3;
  };

  module.events = function(){
    $(window).keydown(function(e){
      keysPressed[e.originalEvent.keyIdentifier] = true;
    });

    $(window).keyup(function(e){
      keysPressed[e.originalEvent.keyIdentifier] = false;
    });

<<<<<<< HEAD
  };

  module.createTimeline = function(){
    $.each(timelineJSON, function(index, post){
      var canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      drawPost(post, canvas);
      addBox(canvas);
    });
  };
 
=======
  }

>>>>>>> e7763d0ed20ac740e1b0aa86009b6969e70fb661
  module.render = function () {
    requestAnimationFrame(module.render);
    if(keysPressed.Up){
      camera.position.z -= 0.1;
      if(camera.position.z < nextRefreshZ){
        nextRefreshZ -= 2;
        loadMore(2);
      }
    }
    if(keysPressed.Down){
      camera.position.z += 0.1;
    }
    if(keysPressed.Right){
      camera.position.x += 0.1;
    }
    if(keysPressed.Left){
      camera.position.x -= 0.1;
    }
    renderer.render(scene, camera);
  };

  return module;

}());

Space.init();
Space.createTimeline();
Space.events();
Space.render();
