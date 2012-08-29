nc.Canvas = function(parent, opts){
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
};