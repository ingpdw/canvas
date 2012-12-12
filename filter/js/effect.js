p.effect.range = function(n){
	return Math.min(255, Math.max(0, n));
};

p.effect.grayscale = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		p.effect.setGrayscale(d, i);
	};
	return pixels;
};

p.effect.setGrayscale = function(pixels, offset) {
	var d = pixels,
		r = d[offset],
		g = d[offset + 1],
		b = d[offset + 2],
		v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	
	d[offset] = d[offset + 1] = d[offset + 2] = v;
};

p.effect.xray = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		p.effect.setXray(d, i);
	};
	return pixels;	

};

p.effect.setXray = function(pixels, offset) {
	var d = pixels;
	d[offset + 0] = 255 - d[offset + 0];
	d[offset + 1] = 255 - d[offset + 1];
	d[offset + 2] = 255 - d[offset + 2];
};

p.effect.threshold = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		p.effect.setThreshold(d, i);
	};
	
	return pixels;
};

p.effect.setThreshold = function(pixels, offset){
	var d = pixels,
		t = 113,
		r = d[offset],
		g = d[offset + 1],
		b = d[offset + 2],
		v = (0.2126*r + 0.7152*g + 0.0722*b >= t) ? 255 : 0;
	d[offset] = d[offset + 1] = d[offset + 2] = v;

	return pixels;
};
	
p.effect.brightness = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		p.effect.setBrightness(d, i);
	};

	return pixels;
};

p.effect.setBrightness = function(pixels, offset){
	var d = pixels,
		a = 33;
		
		d[offset] += a;
		d[offset + 1] += a;
		d[offset + 2] += a;

	return pixels;
};

p.effect.mosaic = function(pixels, s, w, h){

	var d = pixels.data;

	if(s && w && h)
		return p.effect.selectApplyMosaic(pixels, s, w, h);	
	
	for(var i = 0, len = d.length; i < len; i += 4 * p.effect.mosaic.SIZE){
		p.effect.setMosaic(d, i);
	};
	

	return pixels;
};

p.effect.mosaic.SIZE = 8;

p.effect.selectApplyMosaic = function(pixels, s, w, h){
	var d = pixels.data, k = 0;
	
	for(var i = (s.y * w + s.x) * 4, len = (s.y * w + s.w) * 4; len > i; i+=4){ //row
		
		k = p.effect.mosaic.SIZE;
		
		for(var j = i, jlen = (s.h * w + s.x) * 4; jlen > j; j += w * 4){ //col
			
			if(p.effect.mosaic.SIZE === k){
				r = d[j];
				g = d[j + 1];
				b = d[j + 2];
				k = 1;
			}
				d[j] = r;
				d[j + 1] = g;
				d[j + 2] = b;
			k++;
		}
	}		
		
	return pixels;
};

p.effect.setMosaic = function(pixels, offset){
	var d = pixels;
	
	for(var i = offset, len = offset + 4 * p.effect.mosaic.SIZE; len > i; i+=4){
		
		if(i === offset){
			r = d[offset];
			g = d[offset + 1];
			b = d[offset + 2];
		}
		
		d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;
	}
	return pixels;
};

p.effect.selectApply = function(func, pixels, s, w, h){
	var d = pixels.data;
	
	for(var i = (s.y * w + s.x) * 4, len = (s.y * w + s.w) * 4; i < len; i+=4){
		for(var j = i, jlen = (s.h * w + s.x) * 4; jlen > j; j += w * 4){
			func(d, j);	
		}
	}		
	return pixels;
};

p.effect.Filter = {};
p.effect.Filter.saturation = function(pixels, t){
	if(!t) t = 0.3;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			avg = (r + g + b) / 3;
		
			r = (p.effect.range(avg + t * (r -avg)));
			g = (p.effect.range(avg + t * (g -avg)));
			b = (p.effect.range(avg + t * (b -avg)));
			
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;			
	};
	
	return pixels;
  
};

p.effect.Filter.posterize = function(pixels, levels){    
	if(!levels) levels = 70;
    var s = Math.floor(255 / levels);
    
    var d = pixels.data;
    
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	    	r = (p.effect.range(Math.floor(r / s) * s));
			g = (p.effect.range(Math.floor(g / s) * s));
			b = (p.effect.range(Math.floor(b / s) * s));
			
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;
    };
        
    return pixels;
};

p.effect.Filter.tint = function(pixels, min, max){
	if(!min) min = [50, 35, 10];
	if(!max) max = [190, 190, 230];
	
	var d = pixels.data;
	
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = p.effect.range((r - min[0]) * ((255 / (max[0] - min[0]))));
	        g = p.effect.range((g - min[1]) * ((255 / (max[1] - min[1]))));
	        b = p.effect.range((b - min[2]) * ((255 / (max[2] - min[2]))));  
	        
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;        
    }
	
    return pixels;  
};

p.effect.Filter.contrast = function(pixels, val){    
	if(!val) val = 0.8;
	
	var d = pixels.data;
    
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	 
	        r = p.effect.range(255 * (((r / 255)-0.5) * val + 0.5));
	        g = p.effect.range(255 * (((g / 255)-0.5) * val + 0.5));
	        b = p.effect.range(255 * (((b / 255)-0.5) * val + 0.5));  
	        
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;        
    }
	
    return pixels;      
};



p.effect.Filter.grayScale = function(pixels){   
  var d = pixels.data;
  
  for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			avg = (r + g + b) / 3;
	    	
			d[i] = avg;
			d[i + 1] = avg;
			d[i + 2] = avg;           	
  };
  
  return pixels;

};

p.effect.Filter.bias = function(pixels, val){   
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			avg = (r + g + b) / 3;
    	
	        r = p.effect.range(r * ((r / 255) / ((1.0 / val - 1.9) * (0.9 - (r / 255)) + 1)));
	        g = p.effect.range(g * ((g / 255) / ((1.0 / val - 1.9) * (0.9 - (g / 255)) + 1)));
	        b = p.effect.range(b * ((b / 255) / ((1.0 / val - 1.9) * (0.9 - (b / 255)) + 1)));     	
	
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;       	
	};
	
	return pixels;
};

p.effect.Filter.brightness = function(pixels, t){
	if(!t) t = 20;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = p.effect.range(r + t);
	        g = p.effect.range(g + t);
	        b = p.effect.range(b + t);      	
			
	        d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;     
	};
	
	return pixels;      
};


p.effect.Filter.adjust = function(pixels, ra, ga, ba){
	if(!ra) ra = 1;
	if(!ga) ga = 1;
	if(!ba) ba = 1;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = p.effect.range(r * (1 + ra));
	        g = p.effect.range(g * (1 + ga));
	        b = p.effect.range(b * (1 + ba));      
	        
	        d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;   
	}
	
	return pixels;
};

p.effect.Filter.softLight = function(pixels){
	var top = p.effect.copyCanvas(pixels),
		tPixels = top.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		d = pixels.data,
		t = tPixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			a = d[i + 3],
			tr = t[i],
			tg = t[i + 1],
			tb = t[i + 2];
		
		r = (r > 128) ? 255 - ((255 - r) * (255 - (tr - 128))) / 255 : (r * (tr + 128)) / 255;
		g = (g > 128) ? 255 - ((255 - g) * (255 - (tg - 128))) / 255 : (g * (tg + 128)) / 255;
		b = (b > 128) ? 255 - ((255 - b) * (255 - (tb - 128))) / 255 : (b * (tb + 128)) / 255;
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b; 		
	}
	
	return pixels;
	
};

p.effect.Filter.screen = function(pixels){
	var top = p.effect.copyCanvas(pixels),
		tPixels = top.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		d = pixels.data,
		t = tPixels.data;	
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			a = d[i + 3],
			tr = t[i],
			tg = t[i + 1],
			tb = t[i + 2];
		
		r = p.effect.range(255 - (((255 - tr) * (255 - r)) / 255));
		g = p.effect.range(255 - (((255 - tg) * (255 - g)) / 255));
		b = p.effect.range(255 - (((255 - tb) * (255 - b)) / 255));		
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;
		d[i + 3] = a;
	}
	
	return pixels;	
};

p.effect.copyCanvas = function(pixels, img){
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d');
		canvas.width = pixels.width;
		canvas.height = pixels.height;

	(img)?
		ctx.drawImage(img, 0, 0, pixels.width, pixels.height):
		ctx.putImageData(pixels, 0, 0);
		
	return canvas;
};

p.effect.Filter.add = function(pixels, pixels2){
	if(!pixels2) pixels2 = pixels;
	
	var top = p.effect.copyCanvas(pixels),
		bot = p.effect.copyCanvas(pixels2),
		tPixels = top.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		d = bPixels.data,
		t = tPixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			a = d[i + 3],
			tr = t[i],
			tg = t[i + 1],
			tb = t[i + 2];
		
			
		
        d[i] = tr;
		d[i + 1] = tg;
		d[i + 2] = tb;	

	}
	
	return bPixels;		
};

p.effect.Filter.overlay = function(pixels, pixels2){
	
	if(!pixels2) pixels2 = pixels;
	
	var top = p.effect.copyCanvas(pixels),
		bot = p.effect.copyCanvas(pixels2),
		tPixels = top.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		d = bPixels.data,
		t = tPixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			a = d[i + 3],
			tr = t[i],
			tg = t[i + 1],
			tb = t[i + 2];
		
		r = p.effect.range((r > 128) ? 255 - 2 * (255 - tr) * (255 - r) / 255: (r * tr * 2) / 255);
		g = p.effect.range((g > 128) ? 255 - 2 * (255 - tg) * (255 - g) / 255: (g * tg * 2) / 255);
		b = p.effect.range((b > 128) ? 255 - 2 * (255 - tb) * (255 - b) / 255: (b * tb * 2) / 255);		
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;	
		d[i + 3] = a;
	}
	
	return bPixels;	
};

p.effect.Filter.multiply = function(pixels, pixels2){
	
	if(!pixels2) pixels2 = pixels;
	
	var top = p.effect.copyCanvas(pixels),
		bot = p.effect.copyCanvas(pixels2);

	var	tPixels = top.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext('2d').getImageData(0, 0, pixels.width, pixels.height),
		d = bPixels.data,
		t = tPixels.data;
		
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			a = d[i + 3],
			tr = t[i],
			tg = t[i + 1],
			tb = t[i + 2];
		
		r = p.effect.range((tr * r) / 255);
		g = p.effect.range((tg * g) / 255);
		b = p.effect.range((tb * b) / 255);
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b; 	
		d[i + 3] = a;

	}
	
	return bPixels;	
};

p.effect.Cloudy = function(pixels){
	var pe, over;

	var pe = p.effect.Filter.tint(pixels, [0, 0, -100], [220, 220, 210]);
	
	over = p.effect.copyCanvas(p);
	over.getContext('2d').globalAlpha = 0.8;
	oPixels = over.getContext('2d').getImageData(0, 0, pixels.width, pixels.height);	
	pe = p.effect.Filter.overlay(pe, oPixels);

	return pe;
};

p.effect.DreamBlur = function(pixels){
	var pe = p.effect.Filter.multiply(pixels);
	return pe;
};

p.effect.CreamyGreen = function(pixels){
	var pe = p.effect.Filter.screen(pixels);
	return pe;
};

p.effect.Romantic = function(pixels){
	var pe = p.effect.Filter.overlay(pixels);
	return pe;
};

p.effect.maskOverlay = function(pixels){
	var pe = p.effect.Filter.maskOverlay(pixels);
	return pe;
};

//p.effect.maskOverlay2 = function(pixels){
//	var p = p.effect.Filter.maskOverlay2(pixels);
//	return p;
//};

p.effect.effect1 = function(pixels){
	var pe = p.effect.Filter.saturation(pixels, 0.9);
		pe = p.effect.Filter.contrast(pe, 1.15);
		pe = p.effect.Filter.tint(pe, [0, -40, -80], [210, 250, 200]);
		//p = p.effect.Filter.maskOverlay2(p);
	return pe;
};

p.effect.effect2 = function(pixels){
	var	pe = p.effect.Filter.tint(pixels, [-20, -20, -20], [255, 355, 355]);
		pe = p.effect.Filter.screen(pe);
		pe = p.effect.Filter.softLight(pe);
		//p = p.effect.Filter.maskOverlay2(p);
	return pe;
};

p.effect.effect3 = function(pixels){
	var pe = p.effect.Filter.grayScale(pixels);
		pe = p.effect.Filter.tint(pe, [0, -20, -20], [245, 235, 280]);
		pe = p.effect.Filter.softLight(pe);
		//p = effect.Filter.maskOverlay2(p);
	return pe;
};

p.effect.effect4 = function(pixels){
	var pe = p.effect.Filter.tint(pixels, [30, 30, 0], [300, 300, 450]);
		pe = p.effect.Filter.screen(pe);
		//pe = effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect5 = function(pixels){
	var pe = p.effect.Filter.tint(pixels, [0, 0, -100], [220, 220, 210]);
		pe = p.effect.Filter.softLight(pe);
		//pe = effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect6 = function(pixels){
	var pe = p.effect.Filter.saturation(pixels, 0.8);
		pe = p.effect.Filter.tint(pe, [-20, -40, -20], [280, 220, 240]);
		pe = p.effect.Filter.softLight(pe);
		//pe = effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect7 = function(pixels){
	var pe = p.effect.Filter.contrast(pixels, 1.15);
		pe = p.effect.Filter.tint(pe, [-30, -30, -60], [260, 270, 160]);
		//pe = p.effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect8 = function(pixels){
	var pe = p.effect.Filter.tint(pixels, [30, 30, -130], [210, 210, 320]);
		//pe = p.effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect9 = function(pixels){
	var pe = p.effect.Filter.tint(pixels, [0, 0, -40], [250, 400, 250]);
		pe = p.effect.Filter.softLight(pe);
		pe = p.effect.Filter.screen(pe);
		//p = p.effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect10 = function(pixels){
	var pe = p.effect.Filter.saturation(pixels, 0.5);
		pe = p.effect.Filter.contrast(pe, 1.15);
		pe = p.effect.Filter.tint(pe, [0, 0, 0], [350, 350, 350]);
		pe = p.effect.Filter.screen(pe);
		//pe = p.effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect11 = function(pixels){
	var pe = p.effect.Filter.saturation(pixels, 0.2);
		pe = p.effect.Filter.contrast(pe, 1.15);
		pe = p.effect.Filter.tint(pe, [-50, -50, -20], [300, 300, 400]);
		pe = p.effect.Filter.screen(pe);
		pe = p.effect.Filter.softLight(pe);
		//pe = p.effect.Filter.maskOverlay2(p);
	return pe;
};
p.effect.effect12 = function(pixels){
	var pe = p.effect.Filter.saturation(pixels, 0.2);
		pe = p.effect.Filter.tint(pe, [10, 30, 10], [280, 350, 280]);
		pe = p.effect.Filter.screen(pe);
		//p = p.effect.Filter.maskOverlay2(p);
	return pe;
};