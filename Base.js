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