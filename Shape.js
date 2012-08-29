nc.Shape = function(){
};
nc.Shape.prototype = {
	_eventList: ['click', 'mouseover', 'mouseout'],
	_init: function(){},
	_draw: function(){},
	setColor: function(){},
	getColor: function(){},
	_setStyle: function(ctx, opts){
		ctx.fillStyle = opts.fillStyle;
		ctx.strokeStyle = opts.strokeStyle;
		ctx.lineWidth = opts.lineWidth;
		ctx.alpha = opts.alpha;
	},
	_addEvent: function(event){
		if(!event) return;
		if(event['click'] || event['mouseover'] || event['mouseout']) {
			for(var i = 0, len = this._eventList.length; this._eventList[i];i++){
				if(event[this._eventList[i]]){
					nc.Event.addListener(this._panel, this._eventList[i], event[this._eventList[i]]);
					this._panel.style.cursor = 'pointer';
				}
			}
		}
		
	},
	_setSize: function(w, h){
		if(!w && h) return this;
		
		var _size = this.opts.size = {w: w, h: h},
			_w = _size.w, 
			_h = _size.h;
		
		this._panel.width = _w;
		this._panel.height = _h;
		this._panel.style.width = nc.addPx(_w);
		this._panel.style.height = nc.addPx(_h);
		
		return this;
	},
	_setPos: function(x, y){
		var _pos = this.opts.pos = {x: x, y: y},
			_x = _pos.x, 
			_y = _pos.y;
		
		this._panel.style.left = nc.addPx(_x);
		this._panel.style.top = nc.addPx(_y);
		
		return this;
	},
	appendTo: function(parent){
		if(!parent) return;
		parent.appendChild(this._panel);
	}
};