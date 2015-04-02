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
	var width = window.innerWidth;
	var height = window.innerHeight;
	var FPS = 60;
	var radius = 40;
	var n = parseInt(width / (radius + 30) / 2);
	var l = height / 1.5;
	var len = 0.5;

	var world = new World();
	world.create(n, radius, l, FPS, width, 0, len);
	world.run();

	function keyDown(e) {
		if (e.keyCode == 32) {
			world.playPause();
			e.preventDefault();
		} else if (e.keyCode == 81) {
			world.playStep();
		}
	}

	world.playPause();

	document.addEventListener('keydown', keyDown, false);
});
