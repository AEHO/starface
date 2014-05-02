(function(){
  var scene;
  var camera;
  var renderer;
  var maxAnisotropy;
  var canvas;
  var context;
  var texture;
  var material;
  var boxes = [];
  var keysPressed = {
    Up: false,
    Down: false,
    Left: false,
    Right: false
  };

  var setContextContent = function(){
    context = canvas.getContext('2d');
    context.font = "Bold 120px Helvetica";
    context.lineWidth = 4;
    context.strokeStyle = 'rgba(255,255,255,.8)';
    context.fillStyle = "rgba(0,0,0,1)";
    context.strokeText("Testing", 10, 120);
    context.fillText("Testing", 10, 120);
  }

  var addBox = function(canvas){
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = maxAnisotropy;
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var geometry = new THREE.BoxGeometry(1,1,1);
    var box = new THREE.Mesh(geometry, material);
    box.position.x = camera.position.x + Math.random() * 10 - 5;
    box.position.y = camera.position.y + Math.random() * 10 - 5;
    box.position.z = camera.position.z + Math.random() * 10 - 5 - 3;
    boxes.push(box);
    scene.add(box);
  }

  var init = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    maxAnisotropy = renderer.getMaxAnisotropy();
    canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    setContextContent()
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    for(var i=0; i < 20; i++){
      addBox(canvas);
    }
  }

  var events = function(){
    $(window).keydown(function(e){
      console.log(e.originalEvent);
      keysPressed[e.originalEvent.keyIdentifier] = true;
    });

    $(window).keyup(function(e){
      keysPressed[e.originalEvent.keyIdentifier] = false;
    });

  }

  init();
  events();
  
  camera.position.z = 3;
  var render = function () {
    requestAnimationFrame(render);
    if(keysPressed.Up){
      camera.position.z -= 0.1;
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

  render();

}());
