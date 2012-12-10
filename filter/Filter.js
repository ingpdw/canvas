nc.Effect = {};

nc.Effect.range = function(n){
	return Math.min(255, Math.max(0, n));
};

nc.Effect.grayscale = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		nc.Effect.setGrayscale(d, i);
	};
	return pixels;
};

nc.Effect.setGrayscale = function(pixels, offset) {
	var d = pixels,
		r = d[offset],
		g = d[offset + 1],
		b = d[offset + 2],
		v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	
	d[offset] = d[offset + 1] = d[offset + 2] = v;
};

nc.Effect.xray = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		nc.Effect.setXray(d, i);
	};
	return pixels;	

};

nc.Effect.setXray = function(pixels, offset) {
	var d = pixels;
	d[offset + 0] = 255 - d[offset + 0];
	d[offset + 1] = 255 - d[offset + 1];
	d[offset + 2] = 255 - d[offset + 2];
};

nc.Effect.threshold = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		nc.Effect.setThreshold(d, i);
	};
	
	return pixels;
};

nc.Effect.setThreshold = function(pixels, offset){
	var d = pixels,
		t = 113,
		r = d[offset],
		g = d[offset + 1],
		b = d[offset + 2],
		v = (0.2126*r + 0.7152*g + 0.0722*b >= t) ? 255 : 0;
	d[offset] = d[offset + 1] = d[offset + 2] = v;

	return pixels;
};
	
nc.Effect.brightness = function(pixels, s, w, h) {
	var d = pixels.data;

	for (var i = 0, len = d.length; i < len; i+=4) {
		nc.Effect.setBrightness(d, i);
	};

	return pixels;
};

nc.Effect.setBrightness = function(pixels, offset){
	var d = pixels,
		a = 33;
		
		d[offset] += a;
		d[offset + 1] += a;
		d[offset + 2] += a;

	return pixels;
};

nc.Effect.mosaic = function(pixels, s, w, h){

	var d = pixels.data;

	if(s && w && h)
		return nc.Effect.selectApplyMosaic(pixels, s, w, h);	
	
	for(var i = 0, len = d.length; i < len; i += 4 * nc.Effect.mosaic.SIZE){
		nc.Effect.setMosaic(d, i);
	};
	

	return pixels;
};

nc.Effect.mosaic.SIZE = 8;

nc.Effect.selectApplyMosaic = function(pixels, s, w, h){
	var d = pixels.data, k = 0;
	
	for(var i = (s.y * w + s.x) * 4, len = (s.y * w + s.w) * 4; len > i; i+=4){ //row
		
		k = nc.Effect.mosaic.SIZE;
		
		for(var j = i, jlen = (s.h * w + s.x) * 4; jlen > j; j += w * 4){ //col
			
			if(nc.Effect.mosaic.SIZE === k){
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

nc.Effect.setMosaic = function(pixels, offset){
	var d = pixels;
	
	for(var i = offset, len = offset + 4 * nc.Effect.mosaic.SIZE; len > i; i+=4){
		
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

nc.Effect.selectApply = function(func, pixels, s, w, h){
	var d = pixels.data;
	
	for(var i = (s.y * w + s.x) * 4, len = (s.y * w + s.w) * 4; i < len; i+=4){
		for(var j = i, jlen = (s.h * w + s.x) * 4; jlen > j; j += w * 4){
			func(d, j);	
		}
	}		
	return pixels;
};

nc.Effect.Filter = {};
nc.Effect.Filter.saturation = function(pixels, t){
	if(!t) t = 0.3;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
		var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			avg = (r + g + b) / 3;
		
			r = (nc.Effect.range(avg + t * (r -avg)));
			g = (nc.Effect.range(avg + t * (g -avg)));
			b = (nc.Effect.range(avg + t * (b -avg)));
			
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;			
	};
	
	return pixels;
  
};

nc.Effect.Filter.posterize = function(pixels, levels){    
	if(!levels) levels = 70;
    var s = Math.floor(255 / levels);
    
    var d = pixels.data;
    
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	    	r = (nc.Effect.range(Math.floor(r / s) * s));
			g = (nc.Effect.range(Math.floor(g / s) * s));
			b = (nc.Effect.range(Math.floor(b / s) * s));
			
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;
    };
        
    return pixels;
};

nc.Effect.Filter.tint = function(pixels, min, max){
	if(!min) min = [50, 35, 10];
	if(!max) max = [190, 190, 230];
	
	var d = pixels.data;
	
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = nc.Effect.range((r - min[0]) * ((255 / (max[0] - min[0]))));
	        g = nc.Effect.range((g - min[1]) * ((255 / (max[1] - min[1]))));
	        b = nc.Effect.range((b - min[2]) * ((255 / (max[2] - min[2]))));  
	        
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;        
    }
	
    return pixels;  
};

nc.Effect.Filter.contrast = function(pixels, val){    
	if(!val) val = 0.8;
	
	var d = pixels.data;
    
    for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	 
	        r = nc.Effect.range(255 * (((r / 255)-0.5) * val + 0.5));
	        g = nc.Effect.range(255 * (((g / 255)-0.5) * val + 0.5));
	        b = nc.Effect.range(255 * (((b / 255)-0.5) * val + 0.5));  
	        
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;        
    }
	
    return pixels;      
};



nc.Effect.Filter.grayScale = function(pixels){   
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

nc.Effect.Filter.bias = function(pixels, val){   
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2],
			avg = (r + g + b) / 3;
    	
	        r = nc.Effect.range(r * ((r / 255) / ((1.0 / val - 1.9) * (0.9 - (r / 255)) + 1)));
	        g = nc.Effect.range(g * ((g / 255) / ((1.0 / val - 1.9) * (0.9 - (g / 255)) + 1)));
	        b = nc.Effect.range(b * ((b / 255) / ((1.0 / val - 1.9) * (0.9 - (b / 255)) + 1)));     	
	
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;       	
	};
	
	return pixels;
};

nc.Effect.Filter.brightness = function(pixels, t){
	if(!t) t = 20;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = nc.Effect.range(r + t);
	        g = nc.Effect.range(g + t);
	        b = nc.Effect.range(b + t);      	
			
	        d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;     
	};
	
	return pixels;      
};


nc.Effect.Filter.adjust = function(pixels, ra, ga, ba){
	if(!ra) ra = 1;
	if(!ga) ga = 1;
	if(!ba) ba = 1;
	
	var d = pixels.data;
	
	for (var i = 0, len = d.length; i < len; i+=4) {
    	var r = d[i],
			g = d[i + 1],
			b = d[i + 2];
	    	
	        r = nc.Effect.range(r * (1 + ra));
	        g = nc.Effect.range(g * (1 + ga));
	        b = nc.Effect.range(b * (1 + ba));      
	        
	        d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b;   
	}
	
	return pixels;
};

nc.Effect.Filter.softLight = function(pixels){
	var top = nc.Effect.copyCanvas(pixels),
		tPixels = top.getContext().getImageData(0, 0, pixels.width, pixels.height),
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

nc.Effect.Filter.screen = function(pixels){
	var top = nc.Effect.copyCanvas(pixels),
		tPixels = top.getContext().getImageData(0, 0, pixels.width, pixels.height),
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
		
		r = nc.Effect.range(255 - (((255 - tr) * (255 - r)) / 255));
		g = nc.Effect.range(255 - (((255 - tg) * (255 - g)) / 255));
		b = nc.Effect.range(255 - (((255 - tb) * (255 - b)) / 255));		
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;
		d[i + 3] = a;
	}
	
	return pixels;	
};

nc.Effect.copyCanvas = function(pixels, img){
	var canvas = new nc.playinG.Canvas(null, pixels.width, pixels.height, false, true);

	if(img){
		canvas.getContext().drawImage(img, 0, 0, pixels.width, pixels.height);
	}else{
		canvas.getContext().putImageData(pixels, 0, 0);
	}
		
	return canvas;
};

nc.Effect.Filter.add = function(pixels, pixels2){
	if(!pixels2) pixels2 = pixels;
	
	var top = nc.Effect.copyCanvas(pixels),
		bot = nc.Effect.copyCanvas(pixels2),
		tPixels = top.getContext().getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext().getImageData(0, 0, pixels.width, pixels.height),
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

nc.Effect.Filter.overlay = function(pixels, pixels2){
	
	if(!pixels2) pixels2 = pixels;
	
	var top = nc.Effect.copyCanvas(pixels),
		bot = nc.Effect.copyCanvas(pixels2),
		tPixels = top.getContext().getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext().getImageData(0, 0, pixels.width, pixels.height),
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
		
		r = nc.Effect.range((r > 128) ? 255 - 2 * (255 - tr) * (255 - r) / 255: (r * tr * 2) / 255);
		g = nc.Effect.range((g > 128) ? 255 - 2 * (255 - tg) * (255 - g) / 255: (g * tg * 2) / 255);
		b = nc.Effect.range((b > 128) ? 255 - 2 * (255 - tb) * (255 - b) / 255: (b * tb * 2) / 255);		
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b;	
		d[i + 3] = a;
	}
	
	return bPixels;	
};

nc.Effect.Filter.multiply = function(pixels, pixels2){
	
	if(!pixels2) pixels2 = pixels;
	
	var top = nc.Effect.copyCanvas(pixels),
		bot = nc.Effect.copyCanvas(pixels2);

	var	tPixels = top.getContext().getImageData(0, 0, pixels.width, pixels.height),
		bPixels = bot.getContext().getImageData(0, 0, pixels.width, pixels.height),
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
		
		r = nc.Effect.range((tr * r) / 255);
		g = nc.Effect.range((tg * g) / 255);
		b = nc.Effect.range((tb * b) / 255);
		
        d[i] = r;
		d[i + 1] = g;
		d[i + 2] = b; 	
		d[i + 3] = a;

	}
	
	return bPixels;	
};

nc.Effect.Filter.maskOverlay = function(pixels){
	var patt = nc.Effect.copyCanvas(pixels, nc.Effect.overalyImg2),
		pPixels = patt.getContext().getImageData(0, 0, pixels.width, pixels.height),
		
		bot = nc.Effect.copyCanvas(pixels),
		bPixels = bot.getContext().getImageData(0, 0, pixels.width, pixels.height);
	
		var npPixels = nc.Effect.Filter.overlay(pPixels, bPixels);

	return npPixels;
};

nc.Effect.Filter.maskOverlay2 = function(pixels){
	var patt = nc.Effect.copyCanvas(pixels, nc.Effect.overalyImg1),
		pPixels = patt.getContext().getImageData(0, 0, pixels.width, pixels.height),
		
		over = nc.Effect.copyCanvas(pixels, nc.Effect.overalyImg2),
		oPixels = over.getContext().getImageData(0, 0, pixels.width, pixels.height),
		
		normal = nc.Effect.copyCanvas(pixels, nc.Effect.overalyImg3),
		nPixels = normal.getContext().getImageData(0, 0, pixels.width, pixels.height),
		
		bottom = nc.Effect.copyCanvas(pixels),
		bPixels = bottom.getContext().getImageData(0, 0, pixels.width, pixels.height),
		
		newPix = null;

		newPix = nc.Effect.Filter.multiply(pPixels, bPixels);
		newPix = nc.Effect.Filter.overlay(oPixels, newPix);
		newPix = nc.Effect.Filter.multiply(nPixels, newPix);	

	return newPix;
};

nc.Effect.Cloudy = function(pixels){
	var p, over;

	var p = nc.Effect.Filter.tint(pixels, [0, 0, -100], [220, 220, 210]);
	
	over = nc.Effect.copyCanvas(p);
	over.getContext().globalAlpha = 0.8;
	oPixels = over.getContext().getImageData(0, 0, pixels.width, pixels.height);	
	p = nc.Effect.Filter.overlay(p, oPixels);

	return p;
};

nc.Effect.DreamBlur = function(pixels){
	var p = nc.Effect.Filter.multiply(pixels);
	return p;
};

nc.Effect.CreamyGreen = function(pixels){
	var p = nc.Effect.Filter.screen(pixels);
	return p;
};

nc.Effect.Romantic = function(pixels){
	var p = nc.Effect.Filter.overlay(pixels);
	return p;
};

nc.Effect.maskOverlay = function(pixels){
	var p = nc.Effect.Filter.maskOverlay(pixels);
	return p;
};

nc.Effect.maskOverlay2 = function(pixels){
	var p = nc.Effect.Filter.maskOverlay2(pixels);
	return p;
};

nc.Effect.effect1 = function(pixels){
	var p = nc.Effect.Filter.saturation(pixels, 0.9);
		p = nc.Effect.Filter.contrast(p, 1.15);
		p = nc.Effect.Filter.tint(pixels, [0, -40, -80], [210, 250, 200]);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};

nc.Effect.effect2 = function(pixels){
	var	p = nc.Effect.Filter.tint(pixels, [-20, -20, -20], [255, 355, 355]);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};

nc.Effect.effect3 = function(pixels){
	var p = nc.Effect.Filter.grayScale(pixels);
	var p = nc.Effect.Filter.tint(p, [0, -20, -20], [245, 235, 280]);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};

nc.Effect.effect4 = function(pixels){
	var p = nc.Effect.Filter.tint(pixels, [30, 30, 0], [300, 300, 450]);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect5 = function(pixels){
	var p = nc.Effect.Filter.tint(pixels, [0, 0, -100], [220, 220, 210]);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect6 = function(pixels){
	var p = nc.Effect.Filter.saturation(pixels, 0.8);
		p = nc.Effect.Filter.tint(p, [-20, -40, -20], [280, 220, 240]);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect7 = function(pixels){
	var p = nc.Effect.Filter.contrast(pixels, 1.15);
		p = nc.Effect.Filter.tint(p, [-30, -30, -60], [260, 270, 160]);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect8 = function(pixels){
	var p = nc.Effect.Filter.tint(pixels, [30, 30, -130], [210, 210, 320]);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect9 = function(pixels){
	var p = nc.Effect.Filter.tint(pixels, [0, 0, -40], [250, 400, 250]);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect10 = function(pixels){
	var p = nc.Effect.Filter.saturation(pixels, 0.5);
		p = nc.Effect.Filter.contrast(p, 1.15);
		p = nc.Effect.Filter.tint(pixels, [0, 0, 0], [350, 350, 350]);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect11 = function(pixels){
	var p = nc.Effect.Filter.saturation(pixels, 0.2);
		p = nc.Effect.Filter.contrast(p, 1.15);
		p = nc.Effect.Filter.tint(p, [-50, -50, -20], [300, 300, 400]);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.softLight(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};
nc.Effect.effect12 = function(pixels){
	var p = nc.Effect.Filter.saturation(pixels, 0.2);
		p = nc.Effect.Filter.tint(p, [10, 30, 10], [280, 350, 280]);
		p = nc.Effect.Filter.screen(p);
		p = nc.Effect.Filter.maskOverlay2(p);
	return p;
};