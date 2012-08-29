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
