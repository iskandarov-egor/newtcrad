require.config({
   
    paths: {
        konva: "lib/konva"
    }
});

require([
    'World'
], function(
    World
) {

var width = 800;
var height = 400;
var FPS = 60;
var n = 5;
var radius = 25;
var l = 200;
var len = 0.3;

var world = new World();
world.create(n, radius, l, FPS, width, 0, len);
world.run();
function keyDown(e){
	if(e.keyCode == 32){
		world.playPause();
		e.preventDefault();
	} else if (e.keyCode == 81){
		world.playStep();
	}
}

document.addEventListener('keydown',    keyDown,    false);
});
