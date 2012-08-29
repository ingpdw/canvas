nc.Line = function(opts){
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
