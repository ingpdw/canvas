nc.Rect = function(opts){
	this._panel;
	this.opts = {
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
		ctx.fillRect(0, 0, opts.w, opts.h);
	}else{
		opts.ctx.fillStyle = opts.color;
		opts.ctx.fillRect(opts.x, opts.y, opts.w, opts.h);
	}
};