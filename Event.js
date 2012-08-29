nc.Event = function(node, type, handler){
	this._node = node;
	this.type = type;
	this.handler = handler;
};

nc.Event.prototype.remove = function(){
	nc.Event.removeListener(this._node, this.type, this.handler);
	this._node = this.handler = undefined;
};

nc.Event.addListener = function(node, type, handler){
	
	if(type === 'mousewheel' && nc.isFF)
		type = 'DOMMouseScroll';
	
	if (node.addEventListener){
//		if(type === 'resize')
//			type = 'DOMAttrModified';
		node.addEventListener(type, handler, false);
	}else{
//		if(type === 'resize')
//			type = 'propertychange';
		node.attachEvent('on' + type, handler);
	}
	return new nc.Event(node, type, handler);	
};

nc.Event.removeListener = function(node, type, handler){
	if(!node) return;
	if (node.removeEventListener)
		node.removeEventListener(type, handler, false);
	else
		node.detachEvent('on' + type, handler);	
};

nc.Event.preventDefault = function(evt) {
	var evt = evt || window.event;
	(evt.preventDefault)?
		evt.preventDefault():
		evt.returnValue = false;
};

nc.Event.stopPropagation = function(evt){  
	var evt = evt || window.event;
	(evt.stopPropagation)?
		evt.stopPropagation():
		evt.cancelBubble = true; 
};