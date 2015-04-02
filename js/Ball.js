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

	        	        
	    },
	    create: function (base, radius, l, gl, fr, FPS, h, layer, world) {            
	        this.h = h;
	        this.base = base;
	        this.l = l;
	        this.radius = radius;
	        this.gl = gl;
	        this.fr = fr;
	        this.FPS = FPS;

	        var that = this;
	        this.circle = new Konva.Circle({
	            radius: radius,
	            fill: 'blue',
	            stroke: 'black',
	            strokeWidth: 5,
	            x: that.getX(),
	            y: that.getY()
	        });
	        this.line = new Konva.Line({
	            stroke: 'black',
	            strokeWidth: 5,
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
