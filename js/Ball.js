define(
['konva'],

function(Konva){
	function Ball() {this.init(); }
	Ball.prototype = {
	    init: function () {
	        this.held = false;
	        this.fi = 0;
	        this.w = 0;
	        this.h = 0;
	        this.angleLimit = Math.PI / 3;

			this.ACCENT_COLORS = ["#004d40", "#006064", "#00695c", "#00796b", "#00838f", "#00897b", "#0091ea", "#009688", "#0097a7", "#00acc1", "#00bcd4", "#01579b", "#0277bd", "#0288d1", "#039be5", "#03a9f4", "#056f00", "#0a7e07", "#0a8f08", "#0d5302", "#1a237e", "#259b24", "#283593", "#2a36b1", "#303f9f", "#304ffe", "#311b92", "#33691e", "#37474f", "#3949ab", "#3b50ce", "#3d5afe", "#3f51b5", "#4527a0", "#455a64", "#455ede", "#4a148c", "#4d69ff", "#4d73ff", "#4e342e", "#4e6cef", "#512da8", "#536dfe", "#546e7a", "#558b2f", "#5677fc", "#5c6bc0", "#5d4037", "#5e35b1", "#607d8b", "#6200ea", "#651fff", "#673ab7", "#6889ff", "#6a1b9a", "#6d4c41", "#78909c", "#795548", "#7986cb", "#7b1fa2", "#7c4dff", "#7e57c2", "#880e4f", "#8d6e63", "#8e24aa", "#9575cd", "#9c27b0", "#aa00ff", "#ab47bc", "#ad1457", "#b0120a", "#ba68c8", "#bf360c", "#c2185b", "#c41411", "#c51162", "#d01716", "#d500f9", "#d81b60", "#d84315", "#dd191d", "#dd2c00", "#e00032", "#e040fb", "#e51c23", "#e64a19", "#e65100", "#e91e63", "#ef6c00", "#f4511e", "#f50057", "#ff2d6f", "#ff3d00", "#ff4081", "#ff5177", "#ff5722", "#ff6f00", "#ff8f00", "#ffa000"];
	    },
	    create: function (base, radius, l, gl, fr, FPS, h, layer, world) {            
	        this.h = h;
	        this.base = base;
	        this.l = l;
	        this.radius = radius;
	        this.gl = gl;
	        this.fr = fr;
	        this.FPS = FPS;

			var colorId = parseInt(Math.random() * this.ACCENT_COLORS.length);

			var that = this;
	        this.circle = new Konva.Circle({
	            radius: radius,
	            fill: this.ACCENT_COLORS[colorId],
	            stroke: 'black',
	            strokeWidth: 3,
	            x: that.getX(),
	            y: that.getY()
	        });
	        this.line = new Konva.Line({
	            stroke: 'black',
	            strokeWidth: 3,
	            points: [that.base, that.h, that.getX(), that.getY()]
	        });
	        this.circle.on('mousedown', this.mousedown());
	        layer.add(this.line);            
	        layer.add(this.circle);
	    },	    
	    step: function () {
	        if (!this.held)
	        if (this.fi + this.w < this.angleLimit && this.fi + this.w > -this.angleLimit)
	                this.fi += this.w;
	            else
	        { this.w = this.gl * Math.sin(this.fi); this.fi += this.w; }

	        
	            if (this.w > 0) {
	                this.w -= this.fr;
	                if (this.w < 0) this.w = 0;
	            } else {
	                this.w += this.fr;
	                if (this.w > 0) this.w = 0;
	            }
	            if (!this.held) this.w += this.gl * Math.sin(this.fi);
	       // this.moveToMouse();
	        
	    },
	    render: function(){
	        var x = this.getX();
	        var y = this.getY();
	        this.circle.x(x);
	        this.circle.y(y);
	        this.line.points([this.base, this.h, x, y]);
	    },
	    getX: function () {
	        return this.base + (this.l * Math.sin(this.fi));
	    },
	    getY: function () {
	        return this.h + (this.l * Math.cos(this.fi));
	    },
	    mousedown: function () {
	        var that = this;
	        return function (e) {
	            var x = e.evt.layerX;
	            var y = e.evt.layerY;
	            that.mouseDeltaFi = -that.fi - Math.atan2(y - that.h, x - that.base) + Math.PI / 2.0;
	            that.held = true;
	            that.setMouseXY(x, y);
	        }
	    },
	    setMouseXY: function (x, y) {
	        if (this.held) {
	            this.mouseX = x;
	            this.mouseY = y;
	        }
	    },
	    getAngle: function (x, y) {
	        f = -Math.atan2(y - this.h, x - this.base) + Math.PI / 2.0;
	        if (f > this.angleLimit) f = this.angleLimit;
	        if (f < -this.angleLimit) f = -this.angleLimit;
	        return f;
	    },
	    moveToMouse: function () {
	        if (this.held) {
	            var f = -Math.atan2(this.mouseY - this.h, this.mouseX - this.base) + Math.PI / 2.0;

	            this.w = (f - this.mouseDeltaFi - this.fi) / 2;
	        }
	    }
	}
	return Ball;
}
);
