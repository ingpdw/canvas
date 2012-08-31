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
	