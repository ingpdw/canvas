var nc = {};

	nc.setCssText = function(el, value){
		el.style.cssText = value;
	};
	
	nc.extend = function(dest, source){
		for(n in source)
			if(source[n] !== undefined) dest[n] = source[n];
		return dest;
	};
	
	nc.addPx = function(n){
		if(isNaN(n)) n = 0;
		return n + 'px';
	};
	nc.integer = function(n){
		return parseInt(n);
	};
	nc.getStyle = function(el, sStyle){

		if(sStyle === 'height'){
			if(el.offsetHeight !== 0)
			return el.offsetHeight;
		}
		
		if(el.style[sStyle]){
			return el.style[sStyle];
		}
		
		return  (el.currentStyle)?
		el.currentStyle[sStyle]:
		window.getComputedStyle(el, null)[sStyle];
	};	
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
};nc.Event = function(node, type, handler){
	this._node = node;
	this.type = type;
	this.handler = handler;
};

nc.Event.prototype.remove = function(){
	nc.Event.removeListener(this._node, this.type, this.handler);
	this._node = this.handler = undefined;
};

nc.Event.addListener = function(node, type, handler){
	
	if(type === 'mousewheel' && nc.isFF)
		type = 'DOMMouseScroll';
	
	if (node.addEventListener){
//		if(type === 'resize')
//			type = 'DOMAttrModified';
		node.addEventListener(type, handler, false);
	}else{
//		if(type === 'resize')
//			type = 'propertychange';
		node.attachEvent('on' + type, handler);
	}
	return new nc.Event(node, type, handler);	
};

nc.Event.removeListener = function(node, type, handler){
	if(!node) return;
	if (node.removeEventListener)
		node.removeEventListener(type, handler, false);
	else
		node.detachEvent('on' + type, handler);	
};

nc.Event.preventDefault = function(evt) {
	var evt = evt || window.event;
	(evt.preventDefault)?
		evt.preventDefault():
		evt.returnValue = false;
};

nc.Event.stopPropagation = function(evt){  
	var evt = evt || window.event;
	(evt.stopPropagation)?
		evt.stopPropagation():
		evt.cancelBubble = true; 
};nc.Canvas = function(parent, opts){
	this._panel;
	this._parent = (parent instanceof(Object))? 
			parent: document.getElementById(parent);
	this.opts = {
		fillStyle: '#398ea5',
		lineWidth: 2,
		strokeStyle: '#99cc00',
		alpha: 1.0,
		currPoint: {x: 0, y: 0},
		pos: {x: 0, y: 0},
		size: {w: 300, h: 150}
	};nc.extend(this.opts, opts);
	
	this._init();
};

nc.Canvas.prototype = {
	_init: function(){
		var opts = this.opts;
		this._panel = document.createElement('canvas');
		this._panel.style.position = 'absolute';
		this.setSize(opts.size.w, opts.size.h);
		this.setPosition(opts.pos.x, opts.pos.y);
		this._parent.appendChild(this._panel);
		
		if(!this._panel.getContext){
			throw new Error('canvas를 지원하지 않는 브라우저입니다.');
		};
	},
	_parentSizeAndPos: function(){
		var opts = this.opts, pStyle = this._parent.style;
		pStyle.position = 'relative';
		pStyle.overflow = 'hidden';
		pStyle.width = nc.addPx(opts.size.w);
		pStyle.height = nc.addPx(opts.size.h);
		pStyle.top = nc.addPx(opts.pos.y);
		pStyle.left = nc.addPx(opts.pos.x);
	},
	_getCtx: function(){
		return this._panel.getContext('2d');
	},
	_getParent: function(){
		return this._parent;
	},
	getPanel: function(){
		return this._panel;
	},
	appendTo: function(parent){
		parent.appendChild(this._panel);
		return this;
	},
	remove: function(){
		if(this._panel) 
			this._panel.parentNode.removeChild(this._panel);
		
		this._panel = null;	
	},
	setSize: function(w, h){
		if(!w && h) return this;
		
		var _size = this.opts.size = {w: w, h: h},
			_w = _size.w, 
			_h = _size.h;
		
		this._panel.width = _w;
		this._panel.height = _h;
		this._panel.style.width = nc.addPx(_w);
		this._panel.style.height = nc.addPx(_h);
		
		this._parentSizeAndPos();
		return this;
	},
	getSize: function(){
		return this.opts.size;
	},
	lineWeight: function(w){
		this.opts.lineWidth = w;
		return this;
	},
	lineColor: function(c){
		this.opts.strokeStyle = c;
		return this;
	},	
	bgColor: function(color){
		if(!color) return this;
		
		var _color = this.opts.color = color;
		
		this._panel.style.backgroundColor = color;
		
		return this;
	},
	color: function(color){
		this.opts.fillStyle = color;
		
		return this;
	},
	alpha: function(alpha){
		this.opts.alpha = alpha;
		
		return this;
	},	
	setPosition: function(x, y){
		var _pos = this.opts.pos = {x: x, y: y},
			_x = _pos.x, 
			_y = _pos.y;
		
		this._panel.style.left = nc.addPx(_x);
		this._panel.style.top = nc.addPx(_y);
		
		this._parentSizeAndPos();
		return this;
	},
	setDrawImage: function(img, x, y, w, h, callback){
		var image = new Image(), t = this;
		nc.Event.addListener(image, 'load', function(e){
			t._getCtx().drawImage(image, x, y, w, h);
			if(callback) callback();
		});
		image.src = img;
		
		return this;
	},
	getPosition: function(){
		var _x = this._panel.style.left,
			_y = this._panel.style.top;
		return {x: _x, y: _y}; 
	},
	_getCurrStyle: function(){
		var style = {}, opts = this.opts;
			style.lineWidth = opts.lineWidth;
			style.strokeStyle = opts.strokeStyle;
			style.fillStyle = opts.fillStyle;
			style.alpha = opts.alpha;
			
		return style;
	},
	_setEvent: function(handler){
		
	},
	_setCurrPoint: function(point){
		this.opts.currPoint = point;
	},	
	_drawRect: function(obj){
		var opts = this.opts;
		obj.parent = this._getParent();
		obj.ctx = this._getCtx();
		
		nc.extend(obj, this._getCurrStyle());
		
		var cRect = new nc.Rect(obj);
		
		return this;
	},
	_drawLine: function(obj){
		var opts = this.opts;
		obj.ctx = this._getCtx();
		
		nc.extend(obj, this._getCurrStyle());
		
		obj.px = opts.currPoint.x;
		obj.py = opts.currPoint.y;
		
		var cLine = new nc.Line(obj);
		
		this._setCurrPoint({x: obj.x, y: obj.y});
		
		return this;
	},
	_drawText: function(obj){
		var opts = this.opts;
		obj.parent = this._getParent();
		obj.ctx = this._getCtx();
		
		nc.extend(obj, this._getCurrStyle());

		var cText = new nc.Text(obj);
		
		return this;
	},
	_drawCircle: function(obj){
		var opts = this.opts;
		obj.parent = this._getParent();
		obj.ctx = this._getCtx();
		
		nc.extend(obj, this._getCurrStyle());
			
		var cCircle = new nc.Circle(obj);
		
		return this;
	},
	moveTo: function(x, y){
		this._setCurrPoint({x: x, y: y});
		return this;
	},
	lineTo: function(x, y){
		this._drawLine({x: x, y: y});
		return this;
	},
	circle: function(x, y, r, s, e, handler){
		this._drawCircle({cx: x, cy: y, r: r, s: s, e: e, handler: handler});
		return this;
	},
	strokeRect: function(x, y, w, h, handler){
		this._drawRect({x: x, y: y, w: w, h: h, type: 'stroke', handler: handler});
		return this;
	},
	rect: function(x, y, w, h, handler){
		this._drawRect({x: x, y: y, w: w, h: h, handler: handler});
		return this;
	},
	text: function(msg, x, y, family, size, weight, handler){
		this._drawText({msg: msg, x: x, y: y, 
			fontSize: size, fontFamily: family, fontWeight: weight, handler: handler});
		return this;
	},
	text2: function(msg, x, y, font, handler){
		this._drawText({msg: msg, x: x, y: y, 
			fontSize: font.fontSize, fontFamily: font.family, fontWeight: font.weight, handler: handler});
		return this;
	}
};

NcCanvas = function(parent, opts){
	return new nc.Canvas(parent, opts);
};nc.Shape = function(){
};
nc.Shape.prototype = {
	_eventList: ['click', 'mouseover', 'mouseout'],
	_init: function(){},
	_draw: function(){},
	setColor: function(){},
	getColor: function(){},
	_setStyle: function(ctx, opts){
		ctx.fillStyle = opts.fillStyle;
		ctx.strokeStyle = opts.strokeStyle;
		ctx.lineWidth = opts.lineWidth;
		ctx.alpha = opts.alpha;
	},
	_addEvent: function(event){
		if(!event) return;
		if(event['click'] || event['mouseover'] || event['mouseout']) {
			for(var i = 0, len = this._eventList.length; this._eventList[i];i++){
				if(event[this._eventList[i]]){
					nc.Event.addListener(this._panel, this._eventList[i], event[this._eventList[i]]);
					this._panel.style.cursor = 'pointer';
				}
			}
		}
		
	},
	_setSize: function(w, h){
		if(!w && h) return this;
		
		var _size = this.opts.size = {w: w, h: h},
			_w = _size.w, 
			_h = _size.h;
		
		this._panel.width = _w;
		this._panel.height = _h;
		this._panel.style.width = nc.addPx(_w);
		this._panel.style.height = nc.addPx(_h);
		
		return this;
	},
	_setPos: function(x, y){
		var _pos = this.opts.pos = {x: x, y: y},
			_x = _pos.x, 
			_y = _pos.y;
		
		this._panel.style.left = nc.addPx(_x);
		this._panel.style.top = nc.addPx(_y);
		
		return this;
	},
	appendTo: function(parent){
		if(!parent) return;
		parent.appendChild(this._panel);
	}
};nc.Rect = function(opts){
	this._panel;
	this.opts = {
		type: 'fill',
		fillStyle: '#398ea5',
		lineWidth: 2,
		strokeStyle: '#99cc00',
		alpha: 1.0,
		w: 100,
		h: 10, 
		x: 0, 
		y: 0,
		nCanvas: true,
		ctx: null,
		parent: null,
		click: null,
		mouseover: null,
		mouseout: null
	};nc.extend(this.opts, opts);
	
	this._init();
	this._addEvent({click: this.opts.click});
	this._addEvent({mouseover: this.opts.mouseover});
	this._addEvent({mouseout: this.opts.mouseout});
};
nc.Rect.prototype = new nc.Shape;
nc.Rect.prototype._init = function(){
	this._draw();
	if(this.opts.parent && this.opts.nCanvas) 
		this.appendTo(this.opts.parent);
};
nc.Rect.prototype._draw = function(){
	var opts = this.opts, ctx;
	if(opts.nCanvas){
		this._panel = document.createElement('canvas');
		if(this.opts.nCanvas) this._panel.style.position = 'absolute';
		
		this._setSize(opts.w, opts.h);
		this._setPos(opts.x, opts.h);
		
		this._panel.style.left = (opts.x)? nc.addPx(opts.x): 0;
		this._panel.style.top = (opts.y)? nc.addPx(opts.y): 0;
		
		ctx = this._panel.getContext('2d');
		this._setStyle(ctx, opts);
		(opts.type === 'fill')?
				ctx.fillRect(0, 0, opts.w, opts.h):
				ctx.strokeRect(0, 0, opts.w, opts.h);
		
	}else{
		opts.ctx.fillStyle = opts.color;
		opts.ctx.fillRect(opts.x, opts.y, opts.w, opts.h);
	}
};nc.Line = function(opts){
	this._panel;
	this.opts = {
		fillStyle: '#398ea5',
		lineWidth: 2,
		strokeStyle: '#99cc00',
		alpha: 1.0,		
		px: 100, 
		py: 100,
		x: 100, 
		y: 100,
		nCanvas: false,
		ctx: null
	};nc.extend(this.opts, opts);
	
	this._init();
};
nc.Line.prototype = new nc.Shape;
nc.Line.prototype._init = function(){
	var opts = this.opts;
	
	this._draw();
};
nc.Line.prototype._draw = function(){
	var opts = this.opts, ctx;
	if(opts.nCanvas){
	}else{
		ctx = this.opts.ctx;
		ctx.fillStyle = opts.color;
		ctx.strokeStyle = opts.strokeStyle;
		ctx.lineWidth = opts.lineWidth;
		ctx.alpha = opts.alpha;
		ctx.beginPath();
		ctx.moveTo(this.opts.px, this.opts.py);
		ctx.lineTo(this.opts.x, this.opts.y);
		ctx.closePath();
		ctx.stroke();		
	}
};
nc.Text = function(opts){
	this._panel;
	this.opts = {
		fillStyle: '#398ea5',
		lineWidth: 2,
		strokeStyle: '#99cc00',
		alpha: 1.0,			
		fontSize: 12,
		fontFamily: 'dotum',
		fontWeight: 'bold',
		x: 100, 
		y: 12,
		w: 100, 
		h: 20,
		msg: 'helloworld',
		nCanvas: true,
		ctx: null,
		parent: null,
		click: null,
		over: null,
		out: null
	};nc.extend(this.opts, opts);
	
	this.opts.font = this.opts.fontWeight + ' ' + this.opts.fontSize + 'px ' + this.opts.fontFamily;
	
	this._init();
	this._addEvent({click: this.opts.click});
	this._addEvent({over: this.opts.over});
	this._addEvent({out: this.opts.out});
};
nc.Text.prototype = new nc.Shape;
nc.Text.prototype._init = function(){
	this._draw();
	if(this.opts.parent && this.opts.nCanvas) 
		this.appendTo(this.opts.parent);
};
nc.Text.prototype._draw = function(){
	var opts = this.opts, ctx, tw, size;
	if(opts.nCanvas){
		this._panel = document.createElement('canvas');
		if(this.opts.nCanvas) this._panel.style.position = 'absolute';

		this._setPos(opts.x, opts.h);
		
		this._panel.style.left = (opts.x)? nc.addPx(opts.x): 0;
		this._panel.style.top = (opts.y)? nc.addPx(opts.y): 0;
		
		ctx = this._panel.getContext('2d');
		this._setStyle(ctx, opts);
		ctx.font = opts.font;
		ctx.textBaseline = 'bottom';
		
		size = ctx.measureText(opts.msg);
		tw = size.width;
		
		this._setSize(tw, 21);
		//canvas resize
		this._setStyle(ctx, opts);
		ctx.font = opts.font;
		ctx.textBaseline = 'bottom';		
		ctx.fillText(opts.msg, 0, opts.fontSize);
	}else{
		opts.ctx.fillStyle = opts.color;
		opts.ctx.fillText(opts.msg, opts.x, opts.y);
	}
};

nc.Rect.prototype.appendTo = function(parent){
	if(!parent) return;
	parent.appendChild(this._panel);
};
nc.Circle = function(opts){
	this._panel;
	this.opts = {
		fillStyle: '#398ea5',
		lineWidth: 2,
		strokeStyle: '#99cc00',
		alpha: 1.0,		
		cx: 0, 
		cy: 0,
		r: 100,
		s: 0, 
		e: 0,
		w: 0,
		h: 0,
		x: 0,
		y: 0,
		nCanvas: true,
		ctx: null,
		parent: null,
		click: null,
		mouseover: null,
		mouseout: null
	};nc.extend(this.opts, opts);
	
	this.opts.w = this.opts.h = this.opts.r * 2 + this.opts.lineWidth * 2;
	this.opts.x = this.opts.cx - this.opts.r - this.opts.lineWidth;
	this.opts.y = this.opts.cy - this.opts.r - this.opts.lineWidth;;
	this.opts.cx = this.opts.cy = this.opts.r + this.opts.lineWidth;;
	
	this._init();
	
	this._addEvent({click: this.opts.handler && this.opts.handler.click});
	this._addEvent({mouseover: this.opts.handler && this.opts.handler.mouseover});
	this._addEvent({mouseout: this.opts.handler && this.opts.handler.mouseout});
};
nc.Circle.prototype = new nc.Shape;
nc.Circle.prototype._init = function(){
	this._draw();
	
	if(this.opts.parent && this.opts.nCanvas) 
		this.appendTo(this.opts.parent);
};
nc.Circle.prototype._draw = function(){
	var opts = this.opts, ctx, s, e;
	if(opts.nCanvas){
		this._panel = document.createElement('canvas');
		if(this.opts.nCanvas) this._panel.style.position = 'absolute';
		
		this._setSize(opts.w, opts.h);
		this._setPos(opts.x, opts.h);
		
		this._panel.style.left = (opts.x)? nc.addPx(opts.x): 0;
		this._panel.style.top = (opts.y)? nc.addPx(opts.y): 0;
		
		ctx = this._panel.getContext('2d');
		this._setStyle(ctx, opts);
		
		s = opts.s * Math.PI / 180;
		e = opts.e * Math.PI / 180;
		ctx.beginPath();
		if(!(opts.s == 0 && opts.e == 360)) ctx.moveTo(opts.cx, opts.cy);
		ctx.arc(opts.cx, opts.cy, opts.r, s, e, false);
		ctx.closePath();
		ctx.fill();
		if(opts.lineWidth) ctx.stroke();
	}else{
		
	}
};		nc.Layer = function(){
			this._panel = document.createElement('div');
			this._panel.style.position = 'absolute';
			this._panel.className = 'priceLayer';
			
			this._msgPanel = document.createElement('span');
			this._msgPanel.className = 'price';
			
			this._panel.appendChild(this._msgPanel);
			document.getElementById('cvs').appendChild(this._panel);
			
			this.hide();
		};
		nc.Layer.prototype = {
			show: function(){
				this._panel.style.display = 'block';
				this._panel.style.opacity = 0;
				$(this._panel).animate({opacity: 1}, 500);
			},
			hide: function(){
				this._panel.style.display = 'none';
			},
			pos: function(pos){
				if(!pos) return;
				this._panel.style.top = nc.addPx(pos.y);
				this._panel.style.left = nc.addPx(pos.x);
			},
			showMsg: function(msg, x, y){
				this._msgPanel.innerHTML = msg;
				this.pos({x: x, y: y});
				this.show();
			}
		};
