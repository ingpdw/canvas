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
};