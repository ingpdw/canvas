nc.Animate = function(node, styles, options, draggable, type){

	var _queue = nc.Animate.queue,
		_animate = nc.Animate.animate;
	
	this._e = node;
	
	this._o = options;
	
	if(_queue.indexOf(this._e)!== -1){
		if(this._o.removePrevAnimate){
			_animate[_queue.indexOf(this._e)].terminate();
		}else{
			return;
		}
	}

	_queue.push(this._e);
	_animate.push(this);
	
	this.style = this._e.currentStyle? 
		this._e.currentStyle: 
		document.defaultView.getComputedStyle(this._e, null);
	
	this._styles = styles;
	
	this.start = +new Date;
	
	this.dur = this._o.duration || 300;
	
	this.cb = this._o.callback || null;
	
	this.curr = {};
	 
	this.easing = this._o.easing || nc.Easing.easeInOut;
		
	this.end = this.start + this.dur;

 	for(prop in this._styles){
 		this.curr[prop] = this.style[prop];
 	};
 	
	this.interval = setInterval(function(){
		var time = +new Date, value;

		for(prop in this._styles){
				
			if(nc.Animate.STYLE.indexOf(prop) !== -1){ 
				
				value = this.easing(
						time - this.start, nc.integer(this.curr[prop]), 
						nc.integer(this._styles[prop]) - nc.integer(this.curr[prop]), 
						this.dur);
				
				if(prop === 'opacity'){
					this._e.style[prop] = value;
					this._e.style.filter = 'alpha(opacity=' + value * 100 + ')';		
				}else{
					this._e.style[prop] = nc.addPx(value);
				}	
			}
		};

		if(time >= this.end) {
			this.terminate();

		};		
		
	}.binder(this),1000 / 60);

};

nc.Animate.queue = [];
nc.Animate.animate = [];
nc.Animate.STYLE = ['width', 'height', 'top', 'left', 'opacity'];
nc.Animate.prototype.remove = function(node){
	var queue = nc.Animate.queue;
	var idx = queue.indexOf(this._e);
	if(idx !== -1){
		queue.splice(idx, 1);
	};
};

nc.Animate.prototype.terminate = function(){
	for(prop in this._styles)	
		this._e.style[prop] = this._styles[prop];

	clearInterval(this.interval);
	
	if(this.cb)
		this.cb();
	
	this.remove(this._e);
};

nc.Easing = {
	ease: function (t, b, c, d) {
    	return c*t/d + b;
    },
    easeIn: function (t, b, c, d) {
    	return c*(t/=d)*t + b;
    },
    easeIn2: function (t, b, c, d) {
    	return c*(t/=d)*t*t*t + b;
    },
    easeOut: function (t, b, c, d) {
    	return -c *(t/=d)*(t-2) + b;
    },
    easeOut2: function (t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOut: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
    	return -c/2 * ((--t)*(t-2) - 1) + b;
    },    
    bounceIn: function (t, b, c, d) {
    	return c - nc.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
    	if ((t/=d) < (1/2.75)) {
    		return c*(7.5625*t*t) + b;
    	} else if (t < (2/2.75)) {
    		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    	} else if (t < (2.5/2.75)) {
    		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    	}
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },    
    elasticOut: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }    
};