p.command.EffectCommand = function(editor, pixels, oldPixels){
	this._obj = editor;
	this._pixels = pixels;
	this._oldPixels = oldPixels;
	
	p.command.CommandManager.executeCommand(this);
};

p.command.EffectCommand.prototype = new p.command.AbstractCommand;

p.command.EffectCommand.prototype.execute = function(){
	this._obj._setEffect(this._pixels);
	return true;
};

p.command.EffectCommand.prototype.undo = function(){
	var k = this._obj._setEffect(this._oldPixels);	
};