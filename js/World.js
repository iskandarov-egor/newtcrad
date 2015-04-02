define(
['konva', 'Ball'],

function(Konva, Ball){
	function World() { this.init();}
	World.prototype = {
        g0:-9.8,
		init: function(){		
		    this.stage = new Konva.Stage({
		        container: 'worldContainer',
		        width: window.innerWidth,
		        height: window.innerHeight
		    });
		    this.layer = new Konva.Layer();
		    this.stage.add(this.layer);
		    this.playing = false;

		    var canvas = document.getElementById('worldContainer');
		    canvas.addEventListener('mouseup', this.mouseup(), false);
		    canvas.addEventListener('mousemove', this.mousemove(), false);		    
		},
		create: function (n, radius, l, FPS, w, h, len) {
		    this.len=len;
		    this.n = n;
		    this.l = l;
		    this.FPS = FPS;
		    this.g = this.g0 / (FPS * FPS);
		    this.gl = this.g / len;	    
		    var fr =0.15 / (FPS * FPS * len);

		    if(this.n>0) {
		        this.pends = [];
		        this.sounds = [];
		        this.toplay = [];
		    }		    

		    var off = (w - 2 * n * radius) / 2 + radius;
		    for(var i = 0; i < n; i++) {
		        this.pends[i] = new Ball();
		        this.pends[i].create(off + i * 2 * (radius + 1), radius, l, this.gl, fr, FPS, h, this.layer);
		        this.toplay[i] = false;
		        this.sounds[i] = new Audio("click0.ogg");
		        this.sounds[i].volume = 0;
		    }
		},
		playStep: function () {
		    this.step();
		    this.render();
		    console.log('step');
		},
		isInsideNext: function (id) {
		    if (id >= this.n - 1) return false;
		    return (this.l * Math.sin(this.pends[id + 1].fi + this.pends[id + 1].w) < this.l * Math.sin(this.pends[id].fi + this.pends[id].w));		    
		},
		collide: function () {
		    var finished=false;
		    var t = 0;
		    while (!finished)
		    {
		        finished = true;
		        for(var i=0;i<this.n-1;i++) 
		        {
		            
		            if (this.isInsideNext(i)) {
		                /*if (this.pends[i].held) { this.pends[i + 1].w = this.pends[i].w; }
		                else if (this.pends[i + 1].held) this.pends[i].w = this.pends[i + 1].w;
		                else*/ {		                    
		                        var w = this.pends[i].w;
		                        this.pends[i].w = this.pends[i + 1].w;
		                        this.pends[i + 1].w = w;
		                }
		                //this.pends[i + 1].fi = 0.5 * (this.pends[i].fi + this.pends[i + 1].fi);
		                //this.pends[i].fi = this.pends[i + 1].fi;
		                finished = false;
		                this.sounds[i].volume = Math.min(0.99, (Math.abs(this.pends[i + 1].w - this.pends[i].w) * 0.06*this.FPS));
		                this.toplay[i] = true;
		            } 
		        }
		        if (t > this.n+1) { this.mayday(); }
		        t++;
		    }
		    for (var i = 0; i < this.n; i++) if (this.toplay[i]) {
		        this.sounds[i].play();
		        this.sounds[i].currentTime = 0;
		        this.toplay[i] = false;
		    }
		},
		step: function () {
		    this.collide();            
		        for(var i=0;i<this.n;i++) {
		            this.pends[i].step();
		        }
		        for (var i = 0; i < this.n; i++) {
		            if (this.pends[i].held) {
		                this.pends[i].w = 0;
		                for (var j = 0; j < i; j++) if (this.pends[j].fi > this.pends[i].fi) { this.pends[j].fi = this.pends[i].fi; this.pends[j].w = 0; };
		                for (j = i + 1; j < this.n; j++) if (this.pends[j].fi < this.pends[i].fi) { this.pends[j].fi = this.pends[i].fi; this.pends[j].w = 0; }
		            }
		        }
		},
		render: function () {
		    for (var i = 0; i < this.n; i++) {
		        this.pends[i].render();
		    }
		    this.layer.draw();
		},
		playPause: function () {
		    this.playing = !this.playing;
		    if (this.playing) {
		        console.log('running!');
		        //this.run();
		    } else {
		        console.log('pause');
		        for (var i = 0; i < this.n; i++) {
		            this.pends[i].w = 0;
		        }
		    }
		},
		run: function () {
		    var now, dt = 0;
		    var last = window.performance.now();
		    var stepTime = 1000 / this.FPS;
		    var that = this;
		    function frame() {
		        now = window.performance.now();
		        dt += Math.min((now - last), 1000);

		        if (dt > stepTime) {
		            while (dt > stepTime) {
		                dt -= stepTime;
		                if (that.playing) that.step();
		            }

		            that.render();
		            last = now;
		        }
		         requestAnimationFrame(frame);
		    }
		    requestAnimationFrame(frame);
		},
        mousemove: function () {
		    var that = this;
		    return function (e) {
		        var x = e.x - that.stage.attrs.container.offsetLeft;
		        var y = e.y - that.stage.attrs.container.offsetTop;      

		        if (that.playing && false) {
		            for (var i = 0; i < that.n; i++) {		                
		                that.pends[i].setMouseXY(x, y);
		            }
		        } else {
		            for (var i = 0; i < that.n; i++) {
		                if (that.pends[i].held) {
		                    that.pends[i].fi = that.pends[i].getAngle(x, y);
		                    that.pends[i].w = 0;
		                    for (var j = 0; j < i; j++) if (that.pends[j].fi > that.pends[i].fi) { that.pends[j].fi = that.pends[i].fi; that.pends[j].w = 0; };
		                    for (j = i + 1; j < that.n; j++) if (that.pends[j].fi < that.pends[i].fi) {that.pends[j].fi = that.pends[i].fi; that.pends[j].w = 0;}
		                }
		            }
		        }
		    }
        },
        mayday: function () {
            var maydayfactor = -0.03;
            for (var i = 0; i < this.n; i++) {
                this.pends[i].fi = -Math.PI * (1 - 2 * i / (this.n)) / 4;
                this.pends[i].w = 0;
            }
            console.log('day');
        },
        mouseup: function(){
		    var that = this;
		    return function () {
		        for (var i = 0; i < that.n; i++) {
		            that.pends[i].held = false;
		        }
		    }
		},

	}
	return World;
}
);
