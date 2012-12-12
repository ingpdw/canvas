p.Service = function(canvas){
	this.w = window.innerWidth || document.documentElement.offsetWidth;
	this.h = window.innerHeight || document.documentElement.offsetHeight;
	this.canvas = ( canvas )? canvas : this.createCanvas();
	this.ctx = this.canvas.getContext('2d');
	this.orignPixels;
};

p.Service.prototype = {
	init: function(){
		this.createCanvas();
	},
	createCanvas: function(){
		var canvas = document.createElement('canvas');
			canvas.width = this.w;
			canvas.height = this.h;
			
			document.body.appendChild(canvas);
			
		return canvas;
		
	},
	setImage: function(url, callback){
		var img = new Image();
		img.addEventListener('load', function(e){
			var imgW = img.width,
				imgH = img.height;
			
			//TODO size adjust
			imgW = this.w;
			imgH = this.h;
			
			this.ctx.drawImage(img, 0, 0, this.w, this.h);
			img = null;
			
			this.orignPixels = this.ctx.getImageData(0, 0, this.w, this.h);
			
			typeof callback === 'function' && callback('success');
		}.bind(this), false);
		
		img.addEventListener('error', function(e){
			typeof callback === 'function' && callback('error');
		}, false);
		
		img.src = url;	
	},
	_setEffect: function(pixels){
		this.ctx.putImageData(pixels, 0, 0);
	},
	setEffect: function(effect){
		var effectCommand,
			opixels = this.ctx.getImageData(0, 0, this.w, this.h),
			pixels = effect(opixels);
		
		effectCommand = new p.command.EffectCommand(this, pixels, opixels);
	},
	reset: function(){
		this._setEffect(pixels);
	}
};